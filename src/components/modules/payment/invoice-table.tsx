"use client";

import Link from "next/link";
import StatusBadge from "@/components/common/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ADMIN_ROUTES, CUSTOMER_ROUTES } from "@/routes";
import type { Invoice } from "@/types";
import { formatCurrency, formatDate } from "@/utils";
import PayInvoiceButton from "./pay-invoice-button";
import { canRefundInvoice } from "./refund-dialog";

const SKELETON_ROWS = ["a", "b", "c", "d", "e"];

// admin: /admin/invoices, customer: /dashboard/payments
export type InvoiceMode = "admin" | "customer";

export function getInvoiceHref(mode: InvoiceMode, id: string) {
  const base =
    mode === "admin" ? ADMIN_ROUTES.invoices : CUSTOMER_ROUTES.payments;
  return `${base}/${id}`;
}

// status অনুযায়ী কোন তারিখটা দেখানো মানায়
function getDateNote(invoice: Invoice) {
  if (invoice.status === "REFUNDED") {
    return { label: "Refunded", value: invoice.refundedAt };
  }
  if (invoice.status === "PAID") {
    return { label: "Paid", value: invoice.paidAt };
  }
  return { label: "Due", value: invoice.dueDate };
}

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading?: boolean;
  // admin এ customer column আর Refund button, customer এ Pay button
  mode: InvoiceMode;
  // admin: Refund button চাপলে (dialog caller এর হাতে)
  onRefund?: (invoice: Invoice) => void;
}

export default function InvoiceTable({
  invoices,
  isLoading = false,
  mode,
  onRefund,
}: InvoiceTableProps) {
  const isAdmin = mode === "admin";

  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead className="hidden md:table-cell">Service</TableHead>
            {isAdmin ? (
              <TableHead className="hidden lg:table-cell">Customer</TableHead>
            ) : null}
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell">Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? SKELETON_ROWS.map((id) => (
                <TableRow key={id}>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  {isAdmin ? (
                    <TableCell className="hidden lg:table-cell">
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                  ) : null}
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="ml-auto h-7 w-16" />
                  </TableCell>
                </TableRow>
              ))
            : invoices.map((invoice) => {
                const request = invoice.workOrder.assignment.serviceRequest;
                const note = getDateNote(invoice);
                const href = getInvoiceHref(mode, invoice.id);

                return (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <Link
                        href={href}
                        className="block font-medium hover:underline"
                      >
                        {invoice.invoiceNumber}
                      </Link>
                      <span className="block text-xs text-muted-foreground">
                        Issued {formatDate(invoice.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden max-w-56 md:table-cell">
                      <span className="block truncate">{request.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {request.city}
                      </span>
                    </TableCell>
                    {isAdmin ? (
                      <TableCell className="hidden lg:table-cell">
                        {request.customer.name}
                      </TableCell>
                    ) : null}
                    <TableCell className="font-medium tabular-nums">
                      {formatCurrency(invoice.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge kind="payment" value={invoice.status} />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="block text-xs text-muted-foreground">
                        {note.label}
                      </span>
                      <span className="block">{formatDate(note.value)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                        <Link
                          href={href}
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }),
                          )}
                        >
                          View
                        </Link>
                        {isAdmin ? (
                          onRefund && canRefundInvoice(invoice.status) ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onRefund(invoice)}
                            >
                              Refund
                            </Button>
                          ) : null
                        ) : (
                          <PayInvoiceButton
                            invoiceId={invoice.id}
                            status={invoice.status}
                            size="sm"
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}
