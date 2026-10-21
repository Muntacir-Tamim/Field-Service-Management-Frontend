"use client";

import { ClipboardCheckIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import InfoRow from "@/components/common/info-row";
import PageHeader from "@/components/common/page-header";
import StatusBadge from "@/components/common/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTechnician } from "@/hooks";
import { ADMIN_ROUTES } from "@/routes";
import {
  formatDate,
  formatDateTime,
  getErrorMessage,
  getInitials,
  humanizeEnum,
} from "@/utils";
import TechnicianReviewSheet, {
  canReviewTechnician,
  TechnicianFiles,
} from "./technician-review-sheet";

function DetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-72 w-full rounded-xl lg:col-span-2" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

// /admin/technicians/[id]
export default function TechnicianDetail({ id }: { id: string }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const { data, isPending, isError, error, refetch } = useGetTechnician(id);
  const technician = data?.data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={technician?.name ?? "Technician"}
        description={
          technician ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              <StatusBadge
                kind="technician"
                value={technician.verificationStatus}
              />
              <Badge variant={technician.isAvailable ? "success" : "muted"}>
                {technician.isAvailable ? "Available" : "Unavailable"}
              </Badge>
              <span>Applied {formatDate(technician.createdAt)}</span>
            </span>
          ) : undefined
        }
        backHref={ADMIN_ROUTES.technicians}
        backLabel="Technicians"
        actions={
          technician && canReviewTechnician(technician) ? (
            <Button onClick={() => setReviewOpen(true)}>
              <ClipboardCheckIcon />
              {technician.verificationStatus === "REJECTED"
                ? "Re-review application"
                : "Review application"}
            </Button>
          ) : undefined
        }
      />

      {isPending ? (
        <DetailSkeleton />
      ) : isError || !technician ? (
        <EmptyState
          title="Could not load this technician"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            {technician.verificationStatus === "REJECTED" ? (
              <Alert variant="destructive">
                <XCircleIcon />
                <AlertTitle>Application rejected</AlertTitle>
                <AlertDescription>
                  {technician.rejectionReason ?? "No reason was provided."}
                </AlertDescription>
              </Alert>
            ) : null}

            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-3">
                  <Avatar className="size-14">
                    {technician.user.imageUrl ? (
                      <AvatarImage
                        src={technician.user.imageUrl}
                        alt={technician.name}
                      />
                    ) : null}
                    <AvatarFallback>
                      {getInitials(technician.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{technician.name}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {technician.email}
                    </p>
                  </div>
                </div>
                <dl className="grid gap-4 sm:grid-cols-2">
                  <InfoRow label="Phone">
                    {technician.contactNumber ?? "—"}
                  </InfoRow>
                  <InfoRow label="Experience">
                    {technician.experienceYears} years
                  </InfoRow>
                  <InfoRow label="Gender">
                    {humanizeEnum(technician.gender)}
                  </InfoRow>
                  <InfoRow label="Email verified">
                    {technician.user.emailVerified ? "Yes" : "No"}
                  </InfoRow>
                  <div className="sm:col-span-2">
                    <InfoRow label="Address">
                      {technician.address ?? "—"}
                    </InfoRow>
                  </div>
                  <div className="sm:col-span-2">
                    <InfoRow label="Bio">
                      <span className="whitespace-pre-wrap">
                        {technician.bio ?? "—"}
                      </span>
                    </InfoRow>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>
                  Uploaded with the application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TechnicianFiles technician={technician} />
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                {technician.skills.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No skills added.
                  </p>
                ) : (
                  technician.skills.map((entry) => (
                    <div
                      key={entry.skill.id}
                      className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {entry.skill.name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {entry.skill.category}
                        </span>
                      </span>
                      <StatusBadge kind="skillLevel" value={entry.level} />
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <InfoRow label="Status">
                  <StatusBadge
                    kind="technician"
                    value={technician.verificationStatus}
                  />
                </InfoRow>
                <InfoRow label="Reviewed">
                  {technician.reviewedAt
                    ? formatDateTime(technician.reviewedAt)
                    : "Not reviewed yet"}
                </InfoRow>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <TechnicianReviewSheet
        technicianId={reviewOpen ? id : null}
        onOpenChange={setReviewOpen}
      />
    </div>
  );
}
