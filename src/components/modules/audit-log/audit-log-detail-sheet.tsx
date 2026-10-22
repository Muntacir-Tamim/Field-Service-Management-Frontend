"use client";

import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/common/empty-state";
import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAuditLog } from "@/hooks";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES } from "@/routes";
import { getErrorMessage } from "@/utils";
import AuditLogContent from "./audit-log-content";

interface AuditLogDetailSheetProps {
  // null হলে sheet বন্ধ
  logId: string | null;
  onOpenChange: (open: boolean) => void;
}

// ADMIN: audit log table থেকে "View" চাপলে ডান দিক থেকে খোলে
export default function AuditLogDetailSheet({
  logId,
  onOpenChange,
}: AuditLogDetailSheetProps) {
  return (
    <Sheet open={Boolean(logId)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Audit log</SheetTitle>
          <SheetDescription>
            What changed, who did it and when.
          </SheetDescription>
        </SheetHeader>
        {logId ? <SheetBody id={logId} /> : null}
      </SheetContent>
    </Sheet>
  );
}

function SheetBody({ id }: { id: string }) {
  const { data, isPending, isError, error } = useGetAuditLog(id);
  const log = data?.data;

  return (
    <div className="flex flex-col gap-4 px-4 pb-6">
      {isPending ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : isError || !log ? (
        <EmptyState
          title="Could not load this log"
          description={getErrorMessage(error)}
        />
      ) : (
        <>
          <AuditLogContent log={log} />
          <Link
            href={`${ADMIN_ROUTES.auditLogs}/${log.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-fit",
            )}
          >
            <ExternalLinkIcon />
            Open full page
          </Link>
        </>
      )}
    </div>
  );
}
