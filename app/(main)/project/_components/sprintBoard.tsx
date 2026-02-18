"use client";

import React, { useEffect, useState } from "react";
import SprintManager from "./sprintManager";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import status from "../../../../data/status.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CreateIssue from "./createIssue";
import useFetch from "@/hooks/useFetch";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";
import IssueCard from "./issueCard";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import BoardFilters from "./boardFilters";

type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

type Sprint = {
  id: string;
  status: SprintStatus;
};

type Issue = {
  id: string;
  status: string;
  [key: string]: unknown;
};

type StatusColumn = {
  key: string;
  name: string;
};

type SprintBoardProps = {
  sprints: Sprint[];
  projectId: string;
  orgId: string;
};

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const SprintBoard = ({ sprints, projectId, orgId }: SprintBoardProps) => {
  const [currentSprint, setCurrentSprint] = useState<Sprint>(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0],
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);

  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);

  const handleFilterChange = (newFilteredIssues) => {
    setFilteredIssues(newFilteredIssues);
  };

  useEffect(() => {
    if (currentSprint?.id) {
      fetchIssues(currentSprint.id);
    }
  }, [currentSprint?.id]);

  useEffect(() => {
    if (issues) {
      setFilteredIssues(issues);
    }
  }, [issues]);

  const handleAddIssue = (statusKey: string) => {
    setSelectedState(statusKey);
    setIsDrawerOpen(true);
  };

  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueOrder);

  const onDragEnd = async (result) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update board");
      return;
    }
    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end");
      return;
    }
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderedData = [...issues];

    // source and destination list
    const sourceList = newOrderedData.filter(
      (list) => list.status === source.droppableId,
    );

    const destinationList = newOrderedData.filter(
      (list) => list.status === destination.droppableId,
    );

    if (source.droppableId === destination.droppableId) {
      const reorderedCards = reorder(
        sourceList,
        source.index,
        destination.index,
      );

      reorderedCards.forEach((card, i) => {
        card.order = i;
      });
    } else {
      // remove card from the source list
      const [movedCard] = sourceList.splice(source.index, 1);

      // assign the new list id to the moved card
      movedCard.status = destination.droppableId;

      // add new card to the destination list
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((card, i) => {
        card.order = i;
      });

      // update the order for each card in destination list
      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }

    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    setIssues(newOrderedData, sortedIssues);

    updateIssueOrderFn(sortedIssues);
  };

  const handleIssueCreated = () => {
    if (currentSprint?.id) {
      fetchIssues(currentSprint.id);
    }
  };

  if (issuesError) return <div>Error loading issues</div>;

  return (
    <div>
      <SprintManager
        currentSprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {issues && !issuesLoading && (
        <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
      )}

      {(updateIssuesLoading || issuesLoading) && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {(status as StatusColumn[]).map((cols) => (
            <Droppable key={cols.key} droppableId={cols.key}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <h3 className="font-semibold mb-2 text-center">
                    {cols.name}
                  </h3>

                  {(filteredIssues ?? [])
                    .filter((issue: Issue) => issue.status === cols.key)
                    .map((issue: Issue, index: number) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={updateIssuesLoading}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard
                              issue={issue}
                              onDelete={() => fetchIssues(currentSprint.id)}
                              onUpdate={(updated: Issue) =>
                                setIssues((prev) =>
                                  (prev ?? []).map((i) =>
                                    i.id === updated.id ? updated : i,
                                  ),
                                )
                              }
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}

                  {cols.key === "TODO" &&
                    currentSprint.status !== "COMPLETED" && (
                      <Button
                        className="w-full"
                        variant="ghost"
                        onClick={() => handleAddIssue(cols.key)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        <p>Create Issue</p>
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <CreateIssue
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedState}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
};

export default SprintBoard;
