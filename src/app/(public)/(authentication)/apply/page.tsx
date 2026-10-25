import TechnicianApplyForm from "@/components/form/technician-apply-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Apply as a technician",
  description: "Join our network of verified field technicians.",
  path: "/apply",
  noIndex: true,
});

export default function ApplyPage() {
  return <TechnicianApplyForm />;
}
