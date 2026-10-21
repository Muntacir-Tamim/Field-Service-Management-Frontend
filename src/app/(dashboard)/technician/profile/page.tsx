import ProfileView from "@/components/modules/profile/profile-view";
import AvailabilityToggle from "@/components/modules/technician/availability-toggle";

export default function TechnicianProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <AvailabilityToggle />
      <ProfileView />
    </div>
  );
}
