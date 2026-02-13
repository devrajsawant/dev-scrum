// app/(main)/organization/[organizationId]/page.tsx
interface OrganizationProps {
  params: { organizationId: string };
}

const Organization = async ({ params }: OrganizationProps) => {
  const awaitedParams = await params;
  const { organizationId } = awaitedParams;

  return <div>Organization ID: {organizationId}</div>;
};

export default Organization;
