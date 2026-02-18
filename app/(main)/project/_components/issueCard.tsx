"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import IssueDetailsDialog from "./issueDetailsDialog";
import UserAvatar from "./userAvatar";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface User {
  id: string;
  name?: string | null;
  imageUrl?: string | null;
}

interface Issue {
  id: string;
  title: string;
  status: string;
  priority: Priority;
  createdAt: string | Date;
  assignee?: User | null;
}

interface IssueCardProps {
  issue: Issue;
  showStatus?: boolean;
  onDelete?: (...args: unknown[]) => void;
  onUpdate?: (...args: unknown[]) => void;
}

const priorityColor: Record<Priority, string> = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

export default function IssueCard({
  issue,
  showStatus = false,
  onDelete = () => {},
  onUpdate = () => {},
}: IssueCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  const onDeleteHandler = (...params: unknown[]) => {
    router.refresh();
    onDelete(...params);
  };

  const onUpdateHandler = (...params: unknown[]) => {
    router.refresh();
    onUpdate(...params);
  };

  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      <Card
        className={`cursor-pointer hover:shadow-md transition-shadow pt-0  `}
        onClick={() => setIsDialogOpen(true)}
      >
        <CardHeader
          className={` rounded-lg border-t-2 border-l-2 ${priorityColor[issue.priority]} pt-2`}
        >
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant="outline" className="-ml-1">
            {issue.priority}
          </Badge>
        </CardContent>

        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee} />
          <div className="text-xs text-gray-400 w-full">Created {created}</div>
        </CardFooter>
      </Card>

      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          issue={issue}
          onDelete={onDeleteHandler}
          onUpdate={onUpdateHandler}
          borderCol={priorityColor[issue.priority]}
        />
      )}
    </>
  );
}
