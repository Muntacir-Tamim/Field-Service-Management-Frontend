import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addAttachments,
  addPart,
  completeWork,
  getMyWorkOrders,
  getWorkOrderById,
  getWorkOrders,
  markArrived,
  markEnRoute,
  removeAttachment,
  removePart,
  saveServiceReport,
  startWork,
  verifyWorkOrder,
} from "@/api";
import { assignmentKeys, workOrderKeys } from "@/constants";
import type {
  AddPartPayload,
  CompleteWorkPayload,
  MyWorkOrderListParams,
  ServiceReportPayload,
  StartWorkPayload,
  WorkOrderListParams,
} from "@/types";

export function useGetWorkOrders(
  params?: WorkOrderListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: workOrderKeys.list(params),
    queryFn: () => getWorkOrders(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useGetMyWorkOrders(
  params?: MyWorkOrderListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: workOrderKeys.mine(params),
    queryFn: () => getMyWorkOrders(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useGetWorkOrder(id: string) {
  return useQuery({
    queryKey: workOrderKeys.detail(id),
    queryFn: () => getWorkOrderById(id),
    enabled: Boolean(id),
    retry: false,
  });
}

function useWorkOrderMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
    },
  });
}

export function useMarkEnRoute() {
  return useWorkOrderMutation(markEnRoute);
}

export function useMarkArrived() {
  return useWorkOrderMutation(markArrived);
}

export function useStartWork() {
  return useWorkOrderMutation(
    ({ id, payload }: { id: string; payload: StartWorkPayload }) =>
      startWork(id, payload),
  );
}

export function useCompleteWork() {
  return useWorkOrderMutation(
    ({ id, payload }: { id: string; payload: CompleteWorkPayload }) =>
      completeWork(id, payload),
  );
}

export function useAddPart() {
  return useWorkOrderMutation(
    ({ id, payload }: { id: string; payload: AddPartPayload }) =>
      addPart(id, payload),
  );
}

export function useRemovePart() {
  return useWorkOrderMutation(
    ({ id, partId }: { id: string; partId: string }) => removePart(id, partId),
  );
}

export function useAddAttachments() {
  return useWorkOrderMutation(({ id, files }: { id: string; files: File[] }) =>
    addAttachments(id, files),
  );
}

export function useRemoveAttachment() {
  return useWorkOrderMutation(
    ({ id, attachmentId }: { id: string; attachmentId: string }) =>
      removeAttachment(id, attachmentId),
  );
}

export function useSaveServiceReport() {
  return useWorkOrderMutation(
    ({ id, payload }: { id: string; payload: ServiceReportPayload }) =>
      saveServiceReport(id, payload),
  );
}

export function useVerifyWorkOrder() {
  return useWorkOrderMutation(verifyWorkOrder);
}
