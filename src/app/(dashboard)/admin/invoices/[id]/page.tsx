import InvoiceDetail from "@/components/modules/payment/invoice-detail";

export default async function AdminInvoiceDetailPage({
  params,
}: PageProps<"/admin/invoices/[id]">) {
  const { id } = await params;

  return <InvoiceDetail id={id} mode="admin" />;
}
