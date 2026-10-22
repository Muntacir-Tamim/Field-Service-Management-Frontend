"use client";

import EmptyState from "@/components/common/empty-state";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAuditLog } from "@/hooks";
import { ADMIN_ROUTES } from "@/routes";
import { getErrorMessage, humanizeEnum } from "@/utils";
import AuditLogContent from "./audit-log-content";

export default function AuditLogDetail({ id }: { id: string }) {
  const { data, isPending, isError, error, refetch } = useGetAuditLog(id);
  const log = data?.data;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={log ? humanizeEnum(log.action) : "Audit log"}
        backHref={ADMIN_ROUTES.auditLogs}
        backLabel="Audit logs"
      />

      {isPending ? (
        <Skeleton className="h-96 w-full rounded-xl" />
      ) : isError || !log ? (
        <EmptyState
          title="Could not load this log"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <Card>
          <CardContent>
            <AuditLogContent log={log} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
