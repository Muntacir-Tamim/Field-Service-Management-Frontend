"use client";

import Image from "next/image";
import {
  BadgeCheckIcon,
  ExternalLinkIcon,
  MapPinIcon,
  ReceiptTextIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import InfoRow from "@/components/common/info-row";
import PageHeader from "@/components/common/page-header";
import StatusBadge from "@/components/common/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  canEditAttachments,
  canEditParts,
  canEditServiceReport,
  canVerifyWorkOrder,
} from "@/constants";
import { useGetWorkOrder } from "@/hooks";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES, TECHNICIAN_ROUTES } from "@/routes";
import type { WorkOrderDetail as WorkOrderDetailData } from "@/types";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getErrorMessage,
} from "@/utils";
import CreateInvoiceDialog, {
  canCreateInvoice,
} from "@/components/modules/payment/create-invoice-dialog";
import AttachmentsManager from "./attachments-manager";
import PartsManager from "./parts-manager";
import ServiceReportSection from "./service-report-form";
import VerifyWorkOrderDialog from "./verify-work-order-dialog";
import WorkOrderStatusActions from "./work-order-status-actions";
import WorkOrderTimeline from "./work-order-timeline";

function DetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-96 w-full rounded-xl lg:col-span-2" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

function WorkOrderBody({
  order,
  mode,
}: {
  order: WorkOrderDetailData;
  mode: "admin" | "technician";
}) {
  const isTechnician = mode === "technician";
  const { assignment } = order;
  const request = assignment.serviceRequest;
  const needsReport = order.status === "COMPLETED" && !order.serviceReport;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        {needsReport ? (
          <Alert>
            <AlertTitle>Service report missing</AlertTitle>
            <AlertDescription>
              {isTechnician
                ? "Submit the service report below so the admin can verify this job."
                : "The admin can verify this job only after the technician submits the service report."}
            </AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Job details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <InfoRow label="Problem found">
                  <span className="whitespace-pre-wrap">
                    {order.problemFound ?? "—"}
                  </span>
                </InfoRow>
              </div>
              <div className="sm:col-span-2">
                <InfoRow label="Work description">
                  <span className="whitespace-pre-wrap">
                    {order.workDescription ?? "—"}
                  </span>
                </InfoRow>
              </div>
              <InfoRow label="Started">
                {formatDateTime(order.startedAt)}
              </InfoRow>
              <InfoRow label="Completed">
                {formatDateTime(order.completedAt)}
              </InfoRow>
              <InfoRow label="Labor hours">
                {order.laborHours ? `${Number(order.laborHours)} h` : "—"}
              </InfoRow>
              <InfoRow label="Verified">
                {formatDateTime(order.verifiedAt)}
              </InfoRow>
              <div className="sm:col-span-2">
                <InfoRow label="Completion notes">
                  <span className="whitespace-pre-wrap">
                    {order.completionNotes ?? "—"}
                  </span>
                </InfoRow>
              </div>
            </dl>
            {order.completionImageUrl ? (
              <a
                href={order.completionImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-fit"
              >
                <Image
                  src={order.completionImageUrl}
                  alt="Completion proof"
                  width={512}
                  height={256}
                  className="h-auto max-h-64 w-auto rounded-lg border object-cover"
                />
              </a>
            ) : null}
          </CardContent>
        </Card>

        <PartsManager
          workOrderId={order.id}
          parts={order.parts}
          editable={isTechnician && canEditParts(order.status)}
        />

        <AttachmentsManager
          workOrderId={order.id}
          attachments={order.attachments}
          editable={isTechnician && canEditAttachments(order.status)}
        />

        {isTechnician && canEditServiceReport(order.status) ? (
          <ServiceReportSection
            workOrderId={order.id}
            report={order.serviceReport}
            editable
          />
        ) : order.serviceReport ? (
          <ServiceReportSection
            workOrderId={order.id}
            report={order.serviceReport}
            editable={false}
          />
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <WorkOrderTimeline order={order} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Request">{request.title}</InfoRow>
            <InfoRow label="Scheduled">
              {formatDateTime(assignment.scheduledStart)}
              <br />
              to {formatDateTime(assignment.scheduledEnd)}
            </InfoRow>
            <InfoRow label="Address">
              <span className="inline-flex items-start gap-1.5">
                <MapPinIcon
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                {request.address}, {request.city}
              </span>
            </InfoRow>
            <InfoRow label="Customer">
              {request.customer.name}
              {request.customer.contactNumber
                ? ` · ${request.customer.contactNumber}`
                : ""}
            </InfoRow>
            {!isTechnician ? (
              <InfoRow label="Technician">{assignment.technician.name}</InfoRow>
            ) : null}
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href={`${isTechnician ? TECHNICIAN_ROUTES.assignments : ADMIN_ROUTES.assignments}/${assignment.id}`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                )}
              >
                <ExternalLinkIcon />
                Assignment
              </Link>
              {!isTechnician ? (
                <Link
                  href={`${ADMIN_ROUTES.serviceRequests}/${request.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                  )}
                >
                  <ExternalLinkIcon />
                  Request
                </Link>
              ) : null}
            </div>
          </CardContent>
        </Card>

        {order.payment ? (
          <Card>
            <CardHeader>
              <CardTitle>Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="Invoice number">
                {order.payment.invoiceNumber}
              </InfoRow>
              <InfoRow label="Total">
                {formatCurrency(order.payment.totalAmount)}
              </InfoRow>
              <InfoRow label="Payment status">
                <StatusBadge kind="payment" value={order.payment.status} />
              </InfoRow>
              {!isTechnician ? (
                <Link
                  href={`${ADMIN_ROUTES.invoices}/${order.payment.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "w-full",
                  )}
                >
                  Open invoice
                </Link>
              ) : null}
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

// admin: /admin/work-orders/[id], technician: /technician/work-orders/[id]
export default function WorkOrderDetail({
  id,
  mode,
}: {
  id: string;
  mode: "admin" | "technician";
}) {
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const { data, isPending, isError, error, refetch } = useGetWorkOrder(id);
  const order = data?.data;
  const listHref =
    mode === "admin" ? ADMIN_ROUTES.workOrders : TECHNICIAN_ROUTES.workOrders;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={order?.assignment.serviceRequest.title ?? "Work order"}
        description={
          order ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              <StatusBadge kind="workOrder" value={order.status} />
              <span>Created {formatDate(order.createdAt)}</span>
            </span>
          ) : undefined
        }
        backHref={listHref}
        backLabel="Work orders"
        actions={
          order ? (
            mode === "technician" ? (
              <WorkOrderStatusActions
                workOrderId={order.id}
                status={order.status}
              />
            ) : canVerifyWorkOrder(order.status) ? (
              <Button onClick={() => setVerifyOpen(true)}>
                <BadgeCheckIcon />
                Verify work
              </Button>
            ) : canCreateInvoice(order.status, Boolean(order.payment)) ? (
              <Button onClick={() => setInvoiceOpen(true)}>
                <ReceiptTextIcon />
                Create invoice
              </Button>
            ) : order.payment ? (
              <Link
                href={`${ADMIN_ROUTES.invoices}/${order.payment.id}`}
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <ReceiptTextIcon />
                View invoice
              </Link>
            ) : undefined
          ) : undefined
        }
      />

      {isPending ? (
        <DetailSkeleton />
      ) : isError || !order ? (
        <EmptyState
          title="Could not load this work order"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <WorkOrderBody order={order} mode={mode} />
      )}

      {order && mode === "admin" ? (
        <CreateInvoiceDialog
          workOrderId={order.id}
          open={invoiceOpen}
          onOpenChange={setInvoiceOpen}
        />
      ) : null}

      {order ? (
        <VerifyWorkOrderDialog
          workOrderId={order.id}
          open={verifyOpen}
          onOpenChange={setVerifyOpen}
          hasServiceReport={Boolean(order.serviceReport)}
        />
      ) : null}
    </div>
  );
}
