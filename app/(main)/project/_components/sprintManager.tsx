"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import useFetch from "@/hooks/useFetch";
import { updateSprintStatus } from "@/actions/sprint";
import { BarLoader } from "react-spinners";

type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export type Sprint = {
  id: string;
  name: string;
  status: SprintStatus;
  startDate: Date | string;
  endDate: Date | string;
};

type SprintManagerProps = {
  currentSprint: Sprint;
  setSprint: React.Dispatch<React.SetStateAction<Sprint>>;
  sprints: Sprint[];
  projectId: string;
};

const SprintManager = ({
  currentSprint,
  setSprint,
  sprints,
}: SprintManagerProps) => {
  const [status, setStatus] = useState<SprintStatus>(currentSprint.status);

  const startDate = new Date(currentSprint.startDate);
  const endDate = new Date(currentSprint.endDate);
  const now = new Date();

  const {
    fn: updateStatus,
    loading,
    data: updatedStatus,
  } = useFetch(updateSprintStatus);

  useEffect(() => {
    setStatus(currentSprint.status);
  }, [currentSprint]);

  const canStartSprint =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

  const canEndSprint = status === "ACTIVE";

  const handleSprintChange = (value: string) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    if (!selectedSprint) return;

    setSprint(selectedSprint);
    setStatus(selectedSprint.status);
  };

  const handleStatusChange = async (newStatus: SprintStatus) => {
    await updateStatus(currentSprint.id, newStatus);
  };

  useEffect(() => {
    if (!updatedStatus?.success) return;

    setStatus(updatedStatus.sprint.status);

    setSprint((prev) => ({
      ...prev,
      status: updatedStatus.sprint.status,
    }));
  }, [updatedStatus, setSprint]);

  const getStatusText = (): string | null => {
    if (status === "COMPLETED") return "Sprint Ended";

    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Sprint overdue by ${formatDistanceToNow(endDate)}`;
    }

    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Sprint starts in ${formatDistanceToNow(startDate)}`;
    }

    return null;
  };

  const statusText = getStatusText();

  return (
    <>
      <div className="flex items-center gap-3">
        <Select value={currentSprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>

          <SelectContent>
            {sprints.map((spr) => (
              <SelectItem key={spr.id} value={spr.id}>
                {spr.name} ({format(new Date(spr.startDate), "MMM d, yyyy")} to{" "}
                {format(new Date(spr.endDate), "MMM d, yyyy")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {canStartSprint && (
          <Button
            className="bg-green-900 text-white"
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading}
          >
            Start Sprint
          </Button>
        )}

        {canEndSprint && (
          <Button
            className="bg-red-900 text-white"
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
          >
            End Sprint
          </Button>
        )}
      </div>

      {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />}

      {statusText && <Badge className="mt-2 rounded-sm">{statusText}</Badge>}
    </>
  );
};

export default SprintManager;
