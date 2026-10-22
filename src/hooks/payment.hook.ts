import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createInvoice,
  downloadInvoicePdf,
  getAllInvoices,
  getInvoiceById,
  getMyInvoices,
  initiatePayment,
  refundInvoice,
} from "@/api";
import { paymentKeys, workOrderKeys } from "@/constants";
import type {
  CreateInvoicePayload,
  InvoiceListParams,
  RefundInvoicePayload,
} from "@/types";

export function useGetInvoices(
  params?: InvoiceListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => getAllInvoices(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useGetMyInvoices(
  params?: InvoiceListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: paymentKeys.invoices(params),
    queryFn: () => getMyInvoices(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useGetInvoice(id: string) {
  return useQuery({
    queryKey: paymentKeys.invoice(id),
    queryFn: () => getInvoiceById(id),
    enabled: Boolean(id),
    retry: false,
  });
}

function useInvoiceMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.all });
    },
  });
}

export function useInitiatePayment() {
  return useInvoiceMutation(initiatePayment);
}

export function useRefundInvoice() {
  return useInvoiceMutation(
    ({ id, payload }: { id: string; payload: RefundInvoicePayload }) =>
      refundInvoice(id, payload),
  );
}

export function useCreateInvoice() {
  return useInvoiceMutation((payload: CreateInvoicePayload) =>
    createInvoice(payload),
  );
}

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function useDownloadInvoicePdf() {
  return useMutation({
    mutationFn: async ({ id, fileName }: { id: string; fileName: string }) => {
      const blob = await downloadInvoicePdf(id);
      saveBlob(blob, `${fileName}.pdf`);
    },
  });
}
