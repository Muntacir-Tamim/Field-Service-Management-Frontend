import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteAdminUser, getAdminUsers, updateAdminUserStatus } from "@/api";
import { adminUserKeys, auditLogKeys, technicianKeys } from "@/constants";
import type { AdminUserListParams, UpdateUserStatusPayload } from "@/types";

export function useGetAdminUsers(params?: AdminUserListParams) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: () => getAdminUsers(params),
    placeholderData: keepPreviousData,
  });
}

// user বদলালে: user list, technician list (availability/status) আর audit log (নতুন entry) refetch
function useAdminUserMutation<TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUserKeys.all });
      queryClient.invalidateQueries({ queryKey: technicianKeys.all });
      queryClient.invalidateQueries({ queryKey: auditLogKeys.all });
    },
  });
}

export function useUpdateAdminUserStatus() {
  return useAdminUserMutation(
    ({ id, payload }: { id: string; payload: UpdateUserStatusPayload }) =>
      updateAdminUserStatus(id, payload),
  );
}

export function useDeleteAdminUser() {
  return useAdminUserMutation((id: string) => deleteAdminUser(id));
}
