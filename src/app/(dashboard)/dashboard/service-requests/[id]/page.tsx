import ServiceRequestDetailView from "@/components/modules/service-request/service-request-detail";

export default async function ServiceRequestDetailPage({
  params,
}: PageProps<"/dashboard/service-requests/[id]">) {
  const { id } = await params;

  return <ServiceRequestDetailView id={id} />;
}
