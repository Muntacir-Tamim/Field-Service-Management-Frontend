import AuditLogDetail from "@/components/modules/audit-log/audit-log-detail";

export default async function AdminAuditLogDetailPage({
  params,
}: PageProps<"/admin/audit-logs/[id]">) {
  const { id } = await params;

  return <AuditLogDetail id={id} />;
}
