"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type SprintStatus = "PLANNED" | "ACTIVE" | "COMPLETED";

type CreateSprintInput = {
  name: string;
  startDate: Date;
  endDate: Date;
};

export async function createSprint(projectId: string, data: CreateSprintInput) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED",
      projectId,
    },
  });

  return {
    success: true,
    sprint,
  };
}

export async function updateSprintStatus(
  sprintId: string,
  newStatus: SprintStatus,
) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const sprint = await db.sprint.findUnique({
    where: { id: sprintId },
    include: { project: true },
  });

  if (!sprint) {
    throw new Error("Sprint not found");
  }

  if (sprint.project.organizationId !== orgId) {
    throw new Error("Unauthorized");
  }

  if (orgRole !== "org:admin") {
    throw new Error("Only Admin can make this change");
  }

  const now = new Date();
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);

  if (newStatus === "ACTIVE") {
    if (now < startDate || now > endDate) {
      throw new Error("Cannot start sprint outside of its date range");
    }

    if (sprint.status !== "PLANNED") {
      throw new Error("Only planned sprint can be started");
    }

    // ensure only one active sprint per project
    const activeSprint = await db.sprint.findFirst({
      where: {
        projectId: sprint.projectId,
        status: "ACTIVE",
        NOT: { id: sprintId },
      },
    });

    if (activeSprint) {
      throw new Error("Another sprint is already active");
    }
  }

  if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
    throw new Error("Can only complete an active sprint");
  }

  const updatedSprint = await db.sprint.update({
    where: { id: sprintId },
    data: { status: newStatus },
  });

  return {
    success: true,
    sprint: updatedSprint,
  };
}
