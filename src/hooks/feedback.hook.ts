import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createFeedback,
  deleteFeedback,
  getAllFeedbacks,
  getMyFeedbacks,
  getMyTechnicianFeedbacks,
  getTechnicianFeedbacks,
  updateFeedback,
} from "@/api";
import { analyticsKeys, feedbackKeys, serviceRequestKeys } from "@/constants";
import type { FeedbackListParams, UpdateFeedbackPayload } from "@/types";

export function useGetAllFeedbacks(
  params?: FeedbackListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: feedbackKeys.list({ scope: "all", ...params }),
    queryFn: () => getAllFeedbacks(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useGetMyFeedbacks(
  params?: FeedbackListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: feedbackKeys.list({ scope: "mine", ...params }),
    queryFn: () => getMyFeedbacks(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useGetMyTechnicianFeedbacks(
  params?: FeedbackListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: feedbackKeys.list({ scope: "technician-me", ...params }),
    queryFn: () => getMyTechnicianFeedbacks(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useGetTechnicianFeedbacks(
  technicianId: string,
  params?: FeedbackListParams,
) {
  return useQuery({
    queryKey: feedbackKeys.list({
      scope: "technician",
      technicianId,
      ...params,
    }),
    queryFn: () => getTechnicianFeedbacks(technicianId, params),
    enabled: Boolean(technicianId),
    placeholderData: keepPreviousData,
  });
}

function useFeedbackMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceRequestKeys.all });
      queryClient.invalidateQueries({ queryKey: analyticsKeys.all });
    },
  });
}

export function useCreateFeedback() {
  return useFeedbackMutation(createFeedback);
}

export function useUpdateFeedback() {
  return useFeedbackMutation(
    ({ id, payload }: { id: string; payload: UpdateFeedbackPayload }) =>
      updateFeedback(id, payload),
  );
}

export function useDeleteFeedback() {
  return useFeedbackMutation((id: string) => deleteFeedback(id));
}
