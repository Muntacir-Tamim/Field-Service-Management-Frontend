"use client";

import StatusBadge from "@/components/common/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { useGetMyTechnicianProfile, useUpdateMyAvailability } from "@/hooks";
import { getErrorMessage } from "@/utils";

export default function AvailabilityToggle() {
  const { data, isPending } = useGetMyTechnicianProfile();
  const { mutate: update, isPending: updating } = useUpdateMyAvailability();

  const technician = data?.data;

  if (isPending) {
    return <Skeleton className="h-28 w-full rounded-xl" />;
  }
  if (!technician) {
    return null;
  }

  const approved = technician.verificationStatus === "APPROVED";

  const handleChange = (checked: boolean) => {
    update(checked, {
      onSuccess: () =>
        toast.add({
          title: checked ? "You are now available" : "You are now unavailable",
          type: "success",
        }),
      onError: (err) =>
        toast.add({
          title: "Could not update availability",
          description: getErrorMessage(err),
          type: "error",
        }),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          Availability
          <StatusBadge
            kind="technician"
            value={technician.verificationStatus}
          />
        </CardTitle>
        <CardDescription>
          Turn this off when you cannot take new visits. Admins cannot assign
          you while you are unavailable.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!approved ? (
          <Alert>
            <AlertTitle>
              {technician.verificationStatus === "REJECTED"
                ? "Application rejected"
                : "Waiting for approval"}
            </AlertTitle>
            <AlertDescription>
              {technician.verificationStatus === "REJECTED"
                ? (technician.rejectionReason ?? "No reason was provided.")
                : "You will receive assignments once an admin approves your application."}
            </AlertDescription>
          </Alert>
        ) : null}
        <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <label htmlFor="availability-switch">
              {technician.isAvailable
                ? "Available for new visits"
                : "Not taking new visits"}
            </label>
            <Badge variant={technician.isAvailable ? "success" : "muted"}>
              {technician.isAvailable ? "On" : "Off"}
            </Badge>
          </div>
          <Switch
            id="availability-switch"
            checked={technician.isAvailable}
            disabled={updating}
            onCheckedChange={handleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}
