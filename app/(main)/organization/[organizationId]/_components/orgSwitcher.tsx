"use client";
import { OrganizationSwitcher, useOrganization } from "@clerk/nextjs";
import React from "react";

const OrgSwitcher = () => {
  const { isLoaded } = useOrganization();
  if (!isLoaded) {
    return null;
  }
  return (
    <div>
      <OrganizationSwitcher
        hidePersonal
        afterCreateOrganizationUrl="/organization/:slug"
        afterSelectOrganizationUrl="/organization/:slug"
        appearance={{
          elements: {
            organizationSwitcherTrigger:
              "!border !border-gray-300 !rounded-md !px-5 !py-2",
            organizationSwitcherTriggerIcon: "!text-white",
          },
        }}
      />
    </div>
  );
};

export default OrgSwitcher;
