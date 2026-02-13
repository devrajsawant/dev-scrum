"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug: string) {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("user not found");
  }

  const org = await (await clerkClient()).organizations.getOrganization({
    slug,
  });

  if (!org) {
    return null;
  }

  const { data: membership } = await (
    await clerkClient()
  ).organizations.getOrganizationMembershipList({
    organizationId: org.id,
  });

  const userMembership = membership.find(
    (member) => member.publicUserData?.userId === userId,
  );

  if (!userMembership) {
    return null;
  }

  return org;
}