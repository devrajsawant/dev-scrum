import { getProjectByOrg } from "@/actions/project";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import DeleteProject from "./deleteProject";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/types";


type ProjectListProps = {
  orgId: string;
};

const ProjectList = async ({ orgId }: ProjectListProps) => {
  const project: Project[] = await getProjectByOrg(orgId);

  if (project.length === 0) {
    return (
      <div>
        No Project Found{" "}
        <Link
          href="/project/create"
          className="underline underline-offset-2 text-blue-200"
        >
          <Button variant="outline" className="h-8 px-2">
            Create new
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {project.map((pro) => {
        return (
          <Card key={pro.id}>
            <CardHeader className="flex justify-between items-center">
              <Link href={`/project/${pro.id}`} className="underline">
                {pro.name}
              </Link>
              <DeleteProject projectId={pro.id} />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-4">{pro.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProjectList;
