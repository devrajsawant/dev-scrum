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
import { getIssuesForSprint } from "@/actions/issues";
import IssueCard from "./issueCard";

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

  const onDragEnd = (_result: DropResult) => {};

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

                  {(issues ?? [])
                    .filter((issue: Issue) => issue.status === cols.key)
                    .map((issue: Issue, index: number) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={issuesLoading}
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
                              // onUpdate={(updated: Issue) =>
                              //   setIssues((prev) =>
                              //     (prev ?? []).map((i) =>
                              //       i.id === updated.id ? updated : i,
                              //     ),
                              //   )
                              // }
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
