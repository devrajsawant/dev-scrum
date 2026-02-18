"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const client = await clerkClient();

  const org = await client.organizations.getOrganization({
    slug,
  });

  if (!org) {
    return null;
  }

  const { data: memberships } =
    await client.organizations.getOrganizationMembershipList({
      organizationId: org.id,
    });

  const userMembership = memberships.find(
    (member) => member.publicUserData?.userId === userId,
  );

  if (!userMembership) {
    return null;
  }

  return org;
}

export async function getOrganizationUsers(orgId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const client = await clerkClient();

  const organizationMemberships =
    await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userIds = organizationMemberships.data
    .map((membership) => membership.publicUserData?.userId)
    .filter((id): id is string => Boolean(id));

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });

  return users;
}
