import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "./_components/orgSwitcher";
import { SignedIn } from "@clerk/nextjs";
import ProjectList from "./_components/projectList";

interface OrganizationProps {
  params: { organizationId: string };
}

const Organization = async ({ params }: OrganizationProps) => {
  const awaitedParams = await params;
  const { organizationId } = awaitedParams;
  const orgData = await getOrganization(organizationId);
  if (!orgData) {
    return <div>Organization data not found</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-3xl gradient-title-purple pb-2">
          {orgData?.name}&rsquo;s Projects
        </h1>
        <SignedIn>
          <OrgSwitcher />
        </SignedIn>
      </div>
      {/* show org projects  */}
      <div>
        <ProjectList orgId={orgData.id} />
      </div>
      {/* show user assigned and reported bugs here  */}
    </div>
  );
};

export default Organization;
