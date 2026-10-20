import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  cancelServiceRequest,
  createServiceRequest,
  getMyServiceRequests,
  getServiceRequestById,
} from "@/api";
import { serviceRequestKeys } from "@/constants";
import type { MyServiceRequestParams } from "@/types";

export function useGetMyServiceRequests(params?: MyServiceRequestParams) {
  return useQuery({
    queryKey: serviceRequestKeys.mine(params),
    queryFn: () => getMyServiceRequests(params),
    // page / filter বদলালে আগের data দেখিয়ে রাখি
    placeholderData: keepPreviousData,
  });
}

export function useGetServiceRequest(id: string) {
  return useQuery({
    queryKey: serviceRequestKeys.detail(id),
    queryFn: () => getServiceRequestById(id),
    enabled: Boolean(id),
    // 403/404 এ retry করে লাভ নেই
    retry: false,
  });
}

// create / cancel এর পরে সব service request query (list + detail) refetch হয়
function useServiceRequestMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceRequestKeys.all });
    },
  });
}

export function useCreateServiceRequest() {
  return useServiceRequestMutation(createServiceRequest);
}

export function useCancelServiceRequest() {
  return useServiceRequestMutation(cancelServiceRequest);
}
