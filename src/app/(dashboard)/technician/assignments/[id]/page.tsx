import AssignmentDetail from "@/components/modules/assignment/assignment-detail";

export default async function TechnicianAssignmentDetailPage({
  params,
}: PageProps<"/technician/assignments/[id]">) {
  const { id } = await params;

  return <AssignmentDetail id={id} mode="technician" />;
}
