import AdminServiceRequestDetail from "@/components/modules/service-request/admin-service-request-detail";

export default async function AdminServiceRequestDetailPage({
  params,
}: PageProps<"/admin/service-requests/[id]">) {
  const { id } = await params;

  return <AdminServiceRequestDetail id={id} />;
}
