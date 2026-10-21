import WorkOrderDetail from "@/components/modules/work-order/work-order-detail";

export default async function TechnicianWorkOrderDetailPage({
  params,
}: PageProps<"/technician/work-orders/[id]">) {
  const { id } = await params;

  return <WorkOrderDetail id={id} mode="technician" />;
}
