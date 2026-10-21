import WorkOrderDetail from "@/components/modules/work-order/work-order-detail";

export default async function AdminWorkOrderDetailPage({
  params,
}: PageProps<"/admin/work-orders/[id]">) {
  const { id } = await params;

  return <WorkOrderDetail id={id} mode="admin" />;
}
