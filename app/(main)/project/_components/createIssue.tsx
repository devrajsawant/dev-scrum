"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import { z } from "zod";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import MDEditor from "@uiw/react-md-editor";

import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organization";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useFetch from "@/hooks/useFetch";
import { issueSchema } from "@/lib/validator";
import { toast } from "sonner";

type IssueFormValues = z.infer<typeof issueSchema>;

type User = {
  id: string;
  name: string;
};

type IssueCreationDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  sprintId: string;
  status: string;
  projectId: string;
  orgId: string;
  onIssueCreated?: () => void;
};

export default function IssueCreationDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}: IssueCreationDrawerProps) {
  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUsers);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  useEffect(() => {
    if (!isOpen || !orgId) return;
    fetchUsers(orgId);
  }, [isOpen, orgId]);

  const onSubmit: SubmitHandler<IssueFormValues> = async (data) => {
    await createIssueFn(projectId, {
      ...data,
      status,
      sprintId,
    });
  };

  useEffect(() => {
    if (!newIssue) return;

    reset({
      title: "",
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    });

    onClose();
    onIssueCreated?.();
    toast.success("Ticket created successfully")
  }, [newIssue, reset, onClose, onIssueCreated]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl lg:max-w-3xl p-0">
        {usersLoading && <BarLoader width={"100%"} color="#36d7b7" />}

        <div className="max-h-[85vh] overflow-y-auto p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Title</label>
              <Input
                {...register("title")}
                placeholder="Enter Ticket title..."
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Assignee + Priority */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Assignee */}
              <div className="space-y-1 w-full">
                <label className="text-sm font-medium">Assignee</label>

                <Controller
                  name="assigneeId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>

                      <SelectContent>
                        {users?.map((user: User) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.assigneeId && (
                  <p className="text-red-500 text-sm">
                    {errors.assigneeId.message}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Priority</label>

                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <MDEditor
                    value={field.value}
                    onChange={(val) => field.onChange(val || "")}
                    height={300}
                    preview="edit"
                  />
                )}
              />
            </div>

            {/* Error */}
            {error && <p className="text-red-500 text-sm">{error.message}</p>}

            {/* Submit */}
            <Button
              type="submit"
              disabled={createIssueLoading}
              className="w-full h-11 text-base"
            >
              {createIssueLoading ? "Creating Ticket..." : "Create Ticket"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
