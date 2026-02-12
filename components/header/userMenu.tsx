"use client"

import { UserButton } from "@clerk/nextjs";
import { ChartNoAxesGantt } from "lucide-react";
import React from "react";

const UserMenu = () => {
  return (
    <div>
      <UserButton
        appearance={{
          elements: {
            avatarBox: 'w-20 h-20',
          },
        }}
      >
        <UserButton.MenuItems>
          <UserButton.Link
            label="My organizations"
            labelIcon={<ChartNoAxesGantt size={15}/>}
            href="/onboarding"
          />
        </UserButton.MenuItems>
      </UserButton>
    </div>
  );
};

export default UserMenu;
