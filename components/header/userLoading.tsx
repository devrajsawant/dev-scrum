"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import React from "react";
import { BarLoader } from "react-spinners";

const UserLoading = () => {
  const { isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();

  if (!isOrgLoaded || !isUserLoaded) {
    return <BarLoader className="mb-4 w-full" />;
  }

  return <div />;
};

export default UserLoading;
