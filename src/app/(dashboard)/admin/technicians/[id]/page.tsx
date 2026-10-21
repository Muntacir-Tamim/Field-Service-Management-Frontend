import TechnicianDetail from "@/components/modules/technician/technician-detail";

export default async function AdminTechnicianDetailPage({
  params,
}: PageProps<"/admin/technicians/[id]">) {
  const { id } = await params;

  return <TechnicianDetail id={id} />;
}
