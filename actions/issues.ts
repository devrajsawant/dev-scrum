"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";

export type IssueWithUsers = Prisma.IssueGetPayload<{
  include: {
    assignee: true;
    reporter: true;
  };
}>;

export async function getIssuesForSprint(
  sprintId: string,
): Promise<IssueWithUsers[]> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  return db.issue.findMany({
    where: { sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });
}

type CreateIssueInput = {
  title: string;
  description?: string | null;
  status: string;
  priority: string;
  sprintId: string;
  assigneeId?: string | null;
};

export async function createIssue(
  projectId: string,
  data: CreateIssueInput,
): Promise<IssueWithUsers> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  return db.issue.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      projectId,
      sprintId: data.sprintId,
      reporterId: user.id,
      assigneeId: data.assigneeId ?? null,
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });
}

type UpdateOrderInput = {
  id: string;
  status: string;
  order: number;
};

export async function updateIssueOrder(
  updatedIssues: UpdateOrderInput[],
): Promise<{ success: true }> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  await db.$transaction(
    updatedIssues.map((issue) =>
      db.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status,
          order: issue.order,
        },
      }),
    ),
  );

  return { success: true };
}

export async function deleteIssue(issueId: string): Promise<{ success: true }> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (
    issue.reporterId !== user.id &&
    !issue.project.adminIds.includes(user.id)
  ) {
    throw new Error("You don't have permission to delete this issue");
  }

  await db.issue.delete({
    where: { id: issueId },
  });

  return { success: true };
}

type UpdateIssueInput = {
  status?: string;
  priority?: string;
};

export async function updateIssue(
  issueId: string,
  data: UpdateIssueInput,
): Promise<IssueWithUsers> {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (issue.project.organizationId !== orgId) {
    throw new Error("Unauthorized");
  }

  return db.issue.update({
    where: { id: issueId },
    data: {
      status: data.status,
      priority: data.priority,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });
}
