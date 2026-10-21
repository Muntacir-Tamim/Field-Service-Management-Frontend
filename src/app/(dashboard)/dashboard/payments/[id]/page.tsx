import InvoiceDetail from "@/components/modules/payment/invoice-detail";

export default async function CustomerPaymentDetailPage({
  params,
}: PageProps<"/dashboard/payments/[id]">) {
  const { id } = await params;

  return <InvoiceDetail id={id} mode="customer" />;
}
