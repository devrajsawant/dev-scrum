import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { PenBox } from "lucide-react";
import UserMenu from "./userMenu";

const ActionButtons = () => {
  return (
    <div className=" flex gap-2 items-center">
      <Link href={"/project/create"}>
        <Button variant="destructive">
          <PenBox />
          <span> Create Project</span>
        </Button>
      </Link>
      <SignedOut>
        <SignInButton>
            <Button variant="outline">
                Login
            </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserMenu/>
      </SignedIn>
    </div>
  );
};

export default ActionButtons;
