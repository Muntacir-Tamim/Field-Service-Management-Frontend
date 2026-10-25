"use client";

import { ReceiptTextIcon } from "lucide-react";
import { Suspense, useState } from "react";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  PAYMENT_STATUS_OPTIONS,
} from "@/constants";
import {
  useGetInvoices,
  useGetMyInvoices,
  useUrlPage,
  useUrlState,
} from "@/hooks";
import type { Invoice, PaymentStatus } from "@/types";
import { getErrorMessage } from "@/utils";
import InvoiceTable, { type InvoiceMode } from "./invoice-table";
import PaymentResultBanner from "./payment-result-banner";
import RefundDialog from "./refund-dialog";

export default function InvoiceList({ mode }: { mode: InvoiceMode }) {
  const [page, setPage] = useUrlPage(DEFAULT_PAGE);
  const [status, setStatus] = useUrlState<PaymentStatus | "">(
    "invoiceStatus",
    "",
  );
  const [refundTarget, setRefundTarget] = useState<Invoice | null>(null);

  const params = { page, limit: DEFAULT_PAGE_SIZE, status };
  const adminQuery = useGetInvoices(params, { enabled: mode === "admin" });
  const myQuery = useGetMyInvoices(params, { enabled: mode === "customer" });
  const query = mode === "admin" ? adminQuery : myQuery;

  const { data, isPending, isError, error, refetch } = query;
  const invoices = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasFilter = Boolean(status);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={mode === "admin" ? "Invoices" : "Payments"}
        description={
          mode === "admin"
            ? "Track every invoice, its bKash payment and refunds."
            : "Your invoices and payment history. Pay securely with bKash."
        }
      />

      {mode === "customer" ? (
        <Suspense fallback={null}>
          <PaymentResultBanner />
        </Suspense>
      ) : null}

      <FilterBar
        filters={[
          {
            key: "status",
            label: "Status",
            value: status,
            onChange: (value) => {
              setStatus(value as PaymentStatus | "");
              setPage(DEFAULT_PAGE);
            },
            options: PAYMENT_STATUS_OPTIONS,
            allLabel: "All statuses",
          },
        ]}
        onReset={() => {
          setStatus("");
          setPage(DEFAULT_PAGE);
        }}
      />

      {isError ? (
        <EmptyState
          title="Could not load invoices"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !isPending && invoices.length === 0 ? (
        <EmptyState
          icon={ReceiptTextIcon}
          title={
            hasFilter ? "No invoices match your filter" : "No invoices yet"
          }
          description={
            hasFilter
              ? "Try a different status."
              : mode === "admin"
                ? "An invoice can be created once a work order is verified."
                : "Once your completed job is verified, the invoice will show up here."
          }
        />
      ) : (
        <>
          <InvoiceTable
            invoices={invoices}
            isLoading={isPending}
            mode={mode}
            onRefund={mode === "admin" ? setRefundTarget : undefined}
          />
          <TablePagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}

      {mode === "admin" ? (
        <RefundDialog
          invoice={refundTarget}
          onOpenChange={(open) => {
            if (!open) {
              setRefundTarget(null);
            }
          }}
        />
      ) : null}
    </div>
  );
}
