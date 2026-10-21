"use client";

import EmptyState from "@/components/common/empty-state";
import PageHeader from "@/components/common/page-header";
import StatusBadge from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMe } from "@/hooks";
import { formatDate, getErrorMessage, humanizeEnum } from "@/utils";
import ProfileForm from "./profile-form";
import ProfileImageUpload from "./profile-image-upload";

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-72 w-full rounded-xl" />
      <Skeleton className="h-96 w-full rounded-xl lg:col-span-2" />
    </div>
  );
}

// তিন role (customer / technician / admin) এর profile page এ এটাই বসে
export default function ProfileView() {
  const { data, isPending, isError, error } = useGetMe();
  const user = data?.data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My profile"
        description="Update your personal details and profile photo."
      />

      {isPending ? (
        <ProfileSkeleton />
      ) : isError || !user ? (
        <EmptyState
          title="Could not load your profile"
          description={getErrorMessage(error)}
        />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <Card>
            <CardContent className="flex flex-col items-center gap-4">
              <ProfileImageUpload user={user} />
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="font-heading font-medium">{user.name}</p>
                <p className="text-sm break-all text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">{humanizeEnum(user.role)}</Badge>
                <StatusBadge kind="user" value={user.status} />
              </div>
              <p className="text-xs text-muted-foreground">
                Member since {formatDate(user.createdAt)}
              </p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>
                Only the fields you change are saved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
