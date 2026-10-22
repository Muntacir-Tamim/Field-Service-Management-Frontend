import { CheckIcon, XCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getWorkOrderStepIndex, WORK_ORDER_STEPS } from "@/constants";
import { cn } from "@/lib/utils";
import type { WorkOrder } from "@/types";
import { formatDateTime } from "@/utils";

function getStepTime(order: WorkOrder, status: string) {
  switch (status) {
    case "SCHEDULED":
      return order.createdAt;
    case "IN_PROGRESS":
      return order.startedAt;
    case "COMPLETED":
      return order.completedAt;
    case "VERIFIED":
      return order.verifiedAt;
    default:
      return null;
  }
}

export default function WorkOrderTimeline({ order }: { order: WorkOrder }) {
  if (order.status === "CANCELLED") {
    return (
      <Alert variant="destructive">
        <XCircleIcon />
        <AlertTitle>Work order cancelled</AlertTitle>
        <AlertDescription>
          The assignment for this job was cancelled or rescheduled.
        </AlertDescription>
      </Alert>
    );
  }

  const currentIndex = getWorkOrderStepIndex(order.status);

  return (
    <ol className="flex flex-col gap-0">
      {WORK_ORDER_STEPS.map((step, index) => {
        const done = index < currentIndex || order.status === "VERIFIED";
        const current = index === currentIndex && order.status !== "VERIFIED";
        const time = getStepTime(order, step.status);
        const isLast = index === WORK_ORDER_STEPS.length - 1;

        return (
          <li key={step.status} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs",
                  done && "border-primary bg-primary text-primary-foreground",
                  current &&
                    "border-primary text-primary ring-4 ring-primary/15",
                  !done && !current && "text-muted-foreground",
                )}
              >
                {done ? <CheckIcon className="size-3.5" /> : index + 1}
              </span>
              {!isLast ? (
                <span
                  className={cn(
                    "my-1 w-px flex-1 min-h-4",
                    done ? "bg-primary" : "bg-border",
                  )}
                />
              ) : null}
            </div>
            <div className="pb-4">
              <p
                className={cn(
                  "text-sm",
                  current || done ? "font-medium" : "text-muted-foreground",
                )}
              >
                {step.label}
              </p>
              {time && (done || current) ? (
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(time)}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
