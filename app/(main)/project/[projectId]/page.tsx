import { notFound } from "next/navigation";
import { getProject } from "@/actions/project";
import SprintCreationForm from "../_components/createSprint";
import SprintBoard from "../_components/sprintBoard";
import { Project } from "@/types/types";

type ProjectPageProps = {
  params: {
    projectId: string;
  };
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = params;
  const project: Project | null = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1}
      />

      {project.sprints.length > 0 ? (
        <SprintBoard
          sprints={project.sprints}
          projectId={projectId}
          orgId={project.organizationId}
        />
      ) : (
        <div>Create a Sprint from button above</div>
      )}
    </div>
  );
}
