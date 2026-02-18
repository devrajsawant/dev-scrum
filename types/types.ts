export type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

export type Sprint = {
  id: string;
  name: string;
  status: SprintStatus;
  startDate: Date | null;
  endDate: Date | null;
};

export type Project = {
  id: string;
  name: string;
  key: string;
  organizationId: string;
  description: string;
  sprints: Sprint[];
};

export type Issue = {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  projectId: string;
  sprintId?: string | null;
  assignee: any;
  reporter: {
    clerkUserId: string;
  };
};
