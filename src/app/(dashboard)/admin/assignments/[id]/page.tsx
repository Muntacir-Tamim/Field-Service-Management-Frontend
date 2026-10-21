import AssignmentDetail from "@/components/modules/assignment/assignment-detail";

export default async function AdminAssignmentDetailPage({
  params,
}: PageProps<"/admin/assignments/[id]">) {
  const { id } = await params;

  return <AssignmentDetail id={id} mode="admin" />;
}
