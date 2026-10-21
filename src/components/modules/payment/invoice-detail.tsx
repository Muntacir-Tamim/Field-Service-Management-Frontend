"use client";

import { DownloadIcon, ExternalLinkIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import InfoRow from "@/components/common/info-row";
import PageHeader from "@/components/common/page-header";
import StatusBadge from "@/components/common/status-badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { useDownloadInvoicePdf, useGetInvoice } from "@/hooks";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES, CUSTOMER_ROUTES } from "@/routes";
import type { Invoice } from "@/types";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getErrorMessage,
} from "@/utils";
import type { InvoiceMode } from "./invoice-table";
import PayInvoiceButton, { canPayInvoice } from "./pay-invoice-button";
import RefundDialog, { canRefundInvoice } from "./refund-dialog";

function DetailSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Skeleton className="h-96 w-full rounded-xl lg:col-span-2" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 text-sm",
        strong && "border-t pt-3 font-heading text-base font-semibold",
      )}
    >
      <dt className={strong ? undefined : "text-muted-foreground"}>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}

// parts + labor + discount + tax = total
function BreakdownCard({ invoice }: { invoice: Invoice }) {
  const { breakdown, workOrder } = invoice;
  const hours = Number(breakdown.laborHours);
  const hasDiscount = Number(breakdown.discount) > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bill details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="hidden text-right sm:table-cell">
                  Unit price
                </TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrder.parts.map((part) => (
                <TableRow key={part.id}>
                  <TableCell className="max-w-56">
                    <span className="block truncate">{part.name}</span>
                    {part.notes ? (
                      <span className="block truncate text-xs text-muted-foreground">
                        {part.notes}
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {part.quantity}
                  </TableCell>
                  <TableCell className="hidden text-right tabular-nums sm:table-cell">
                    {formatCurrency(part.unitCost)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {formatCurrency(part.totalCost)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Labor</TableCell>
                <TableCell className="text-right tabular-nums">
                  {hours} h
                </TableCell>
                <TableCell className="hidden text-right tabular-nums sm:table-cell">
                  {hours > 0
                    ? formatCurrency(Number(breakdown.laborCost) / hours)
                    : "—"}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(breakdown.laborCost)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <dl className="space-y-3">
          <SummaryRow
            label="Parts"
            value={formatCurrency(breakdown.partsTotal)}
          />
          <SummaryRow
            label="Labor"
            value={formatCurrency(breakdown.laborCost)}
          />
          <SummaryRow
            label="Subtotal"
            value={formatCurrency(breakdown.subtotal)}
          />
          {hasDiscount ? (
            <SummaryRow
              label="Discount"
              value={`−${formatCurrency(breakdown.discount)}`}
            />
          ) : null}
          <SummaryRow label="Tax" value={formatCurrency(breakdown.taxAmount)} />
          <SummaryRow
            label="Total"
            value={formatCurrency(breakdown.totalAmount)}
            strong
          />
        </dl>
      </CardContent>
    </Card>
  );
}

function InvoiceBody({
  invoice,
  mode,
}: {
  invoice: Invoice;
  mode: InvoiceMode;
}) {
  const isAdmin = mode === "admin";
  const { workOrder } = invoice;
  const request = workOrder.assignment.serviceRequest;
  const payable = canPayInvoice(invoice.status);
  const isOverdue =
    payable &&
    invoice.dueDate !== null &&
    new Date(invoice.dueDate) < new Date();
  const lastAttemptFailed =
    invoice.status === "FAILED" || invoice.status === "CANCELLED";
  const isRefunded = invoice.status === "REFUNDED";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        {!isAdmin && lastAttemptFailed ? (
          <Alert variant="warning">
            <AlertTitle>
              {invoice.status === "FAILED"
                ? "Your last payment failed"
                : "Your last payment was cancelled"}
            </AlertTitle>
            <AlertDescription>
              This invoice is still unpaid. You can try the payment again.
            </AlertDescription>
          </Alert>
        ) : null}

        {!isAdmin && isOverdue && !lastAttemptFailed ? (
          <Alert variant="warning">
            <AlertTitle>This invoice is overdue</AlertTitle>
            <AlertDescription>
              It was due on {formatDate(invoice.dueDate)}. Please pay as soon as
              you can.
            </AlertDescription>
          </Alert>
        ) : null}

        <BreakdownCard invoice={invoice} />

        {invoice.notes ? (
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{invoice.notes}</p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Status">
              <StatusBadge kind="payment" value={invoice.status} />
            </InfoRow>
            <InfoRow label="Amount">
              {formatCurrency(invoice.totalAmount)}
            </InfoRow>
            <InfoRow label="Method">
              {invoice.method === "BKASH" ? "bKash" : "—"}
            </InfoRow>
            {invoice.transactionId ? (
              <InfoRow label="Transaction ID">
                <span className="font-mono text-xs break-all">
                  {invoice.transactionId}
                </span>
              </InfoRow>
            ) : null}
            <InfoRow label="Paid on">{formatDateTime(invoice.paidAt)}</InfoRow>
            <InfoRow label="Due date">
              <span className="inline-flex flex-wrap items-center gap-2">
                {formatDate(invoice.dueDate)}
                {isOverdue ? <Badge variant="warning">Overdue</Badge> : null}
              </span>
            </InfoRow>
            <InfoRow label="Issued">{formatDateTime(invoice.sentAt)}</InfoRow>
          </CardContent>
        </Card>

        {isRefunded ? (
          <Card>
            <CardHeader>
              <CardTitle>Refund</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="Refunded amount">
                {formatCurrency(invoice.refundAmount)}
              </InfoRow>
              <InfoRow label="Refunded on">
                {formatDateTime(invoice.refundedAt)}
              </InfoRow>
              {invoice.refundTransactionId ? (
                <InfoRow label="Refund transaction ID">
                  <span className="font-mono text-xs break-all">
                    {invoice.refundTransactionId}
                  </span>
                </InfoRow>
              ) : null}
              <InfoRow label="Reason">
                <span className="whitespace-pre-wrap">
                  {invoice.refundReason ?? "—"}
                </span>
              </InfoRow>
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle>Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <InfoRow label="Request">{request.title}</InfoRow>
            <InfoRow label="Address">
              <span className="inline-flex items-start gap-1.5">
                <MapPinIcon
                  className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                {request.address}, {request.city}
              </span>
            </InfoRow>
            <InfoRow label="Technician">
              {workOrder.assignment.technician.name}
            </InfoRow>
            {isAdmin ? (
              <InfoRow label="Customer">
                {request.customer.name}
                <br />
                <span className="text-muted-foreground">
                  {request.customer.email}
                  {request.customer.contactNumber
                    ? ` · ${request.customer.contactNumber}`
                    : ""}
                </span>
              </InfoRow>
            ) : null}
            <InfoRow label="Work verified">
              {formatDateTime(workOrder.verifiedAt)}
            </InfoRow>
            <div className="flex flex-wrap gap-2 pt-1">
              {isAdmin ? (
                <>
                  <Link
                    href={`${ADMIN_ROUTES.workOrders}/${workOrder.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    <ExternalLinkIcon />
                    Work order
                  </Link>
                  <Link
                    href={`${ADMIN_ROUTES.serviceRequests}/${request.id}`}
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                    )}
                  >
                    <ExternalLinkIcon />
                    Request
                  </Link>
                </>
              ) : (
                <Link
                  href={`${CUSTOMER_ROUTES.serviceRequests}/${request.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                  )}
                >
                  <ExternalLinkIcon />
                  View request
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// admin: /admin/invoices/[id], customer: /dashboard/payments/[id]
export default function InvoiceDetail({
  id,
  mode,
}: {
  id: string;
  mode: InvoiceMode;
}) {
  const [refundOpen, setRefundOpen] = useState(false);
  const { data, isPending, isError, error, refetch } = useGetInvoice(id);
  const { mutate: downloadPdf, isPending: isDownloading } =
    useDownloadInvoicePdf();
  const invoice = data?.data;
  const isAdmin = mode === "admin";

  const handleDownload = () => {
    if (!invoice) {
      return;
    }
    downloadPdf(
      { id: invoice.id, fileName: invoice.invoiceNumber },
      {
        onError: () => {
          toast.add({
            title: "Could not download the PDF",
            description: "Please try again in a moment.",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={invoice?.invoiceNumber ?? "Invoice"}
        description={
          invoice ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              <StatusBadge kind="payment" value={invoice.status} />
              <span>Issued {formatDate(invoice.createdAt)}</span>
            </span>
          ) : undefined
        }
        backHref={isAdmin ? ADMIN_ROUTES.invoices : CUSTOMER_ROUTES.payments}
        backLabel={isAdmin ? "Invoices" : "Payments"}
        actions={
          invoice ? (
            <>
              <Button
                variant="outline"
                disabled={isDownloading}
                onClick={handleDownload}
              >
                {isDownloading ? <Spinner /> : <DownloadIcon />}
                Download PDF
              </Button>
              {isAdmin ? (
                canRefundInvoice(invoice.status) ? (
                  <Button
                    variant="destructive"
                    onClick={() => setRefundOpen(true)}
                  >
                    Refund
                  </Button>
                ) : null
              ) : (
                <PayInvoiceButton
                  invoiceId={invoice.id}
                  status={invoice.status}
                />
              )}
            </>
          ) : undefined
        }
      />

      {isPending ? (
        <DetailSkeleton />
      ) : isError || !invoice ? (
        <EmptyState
          title="Could not load this invoice"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <InvoiceBody invoice={invoice} mode={mode} />
      )}

      {isAdmin ? (
        <RefundDialog
          invoice={refundOpen && invoice ? invoice : null}
          onOpenChange={setRefundOpen}
        />
      ) : null}
    </div>
  );
}
