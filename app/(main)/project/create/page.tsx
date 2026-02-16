"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import OrgSwitcher from "../../organization/[organizationId]/_components/orgSwitcher";

import { projectSchema } from "@/lib/validator";
import { createProject } from "@/actions/project";

import { BarLoader } from "react-spinners";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";

type ProjectFormValues = z.infer<typeof projectSchema>;

const CreateProject = () => {
  const router = useRouter();

  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();

  const isAdmin =
    isOrgLoaded &&
    isUserLoaded &&
    membership?.role === "org:admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      key: "",
      description: "",
    },
  });

  const {
    loading: isLoading,
    error,
    data: project,
    fn: createProjectFn,
  } = useFetch(createProject);

  const onSubmit = async (data: ProjectFormValues) => {
    if (!isAdmin) {
      alert("Only organization admins can create projects");
      return;
    }

    await createProjectFn(data);
  };

  useEffect(() => {
    toast.success("Project created successfully")
    if (project) {
      router.push(`/project/${project.id}`);
    }
  }, [project, router]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title-purple">
          Oops! Only Admins can create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-6xl text-center font-bold mb-8 gradient-title-purple">
        Create New Project
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4 w-[50%] mx-auto"
      >
        <div>
          <Input
            id="name"
            {...register("name")}
            className="bg-slate-950"
            placeholder="Project Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Input
            id="key"
            {...register("key")}
            className="bg-slate-950"
            placeholder="Project Key (Ex: Dev-Hub)"
          />
          {errors.key && (
            <p className="text-red-500 text-sm mt-1">
              {errors.key.message}
            </p>
          )}
        </div>

        <div>
          <Textarea
            id="description"
            {...register("description")}
            className="bg-slate-950 h-28"
            placeholder="Project Description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {isLoading && (
          <BarLoader width={"100%"} color="#36d7b7" className="mb-4" />
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white"
          size="lg"
        >
          {isLoading ? "Creating..." : "Create Project"}
        </Button>

        {error && (
          <p className="text-red-500 mt-2">{error.message}</p>
        )}
      </form>
    </div>
  );
};

export default CreateProject;
