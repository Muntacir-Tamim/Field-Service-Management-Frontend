import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  cancelAssignment,
  confirmAssignment,
  createAssignment,
  getAssignmentById,
  getAssignments,
  getAvailableTechnicians,
  getMyAssignments,
  rescheduleAssignment,
} from "@/api";
import {
  assignmentKeys,
  serviceRequestKeys,
  technicianKeys,
  workOrderKeys,
} from "@/constants";
import type {
  AssignmentListParams,
  AvailableTechnicianParams,
  CancelAssignmentPayload,
  MyAssignmentListParams,
  ReschedulePayload,
} from "@/types";

export function useGetAssignments(
  params?: AssignmentListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: assignmentKeys.list(params),
    queryFn: () => getAssignments(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useGetMyAssignments(
  params?: MyAssignmentListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: assignmentKeys.mine(params),
    queryFn: () => getMyAssignments(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useGetAssignment(id: string) {
  return useQuery({
    queryKey: assignmentKeys.detail(id),
    queryFn: () => getAssignmentById(id),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useGetAvailableTechnicians(
  params: Partial<AvailableTechnicianParams>,
  enabled = true,
) {
  const ready = Boolean(params.scheduledStart && params.scheduledEnd);

  return useQuery({
    queryKey: technicianKeys.available(params),
    queryFn: () => getAvailableTechnicians(params as AvailableTechnicianParams),
    enabled: enabled && ready,
    placeholderData: keepPreviousData,
  });
}

function useAssignmentMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: assignmentKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceRequestKeys.all });
      queryClient.invalidateQueries({ queryKey: workOrderKeys.all });
      queryClient.invalidateQueries({ queryKey: technicianKeys.available() });
    },
  });
}

export function useCreateAssignment() {
  return useAssignmentMutation(createAssignment);
}

export function useRescheduleAssignment() {
  return useAssignmentMutation(
    ({ id, payload }: { id: string; payload: ReschedulePayload }) =>
      rescheduleAssignment(id, payload),
  );
}

export function useConfirmAssignment() {
  return useAssignmentMutation(confirmAssignment);
}

export function useCancelAssignment() {
  return useAssignmentMutation(
    ({ id, payload }: { id: string; payload: CancelAssignmentPayload }) =>
      cancelAssignment(id, payload),
  );
}
