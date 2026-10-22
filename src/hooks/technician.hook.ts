import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addMySkill,
  applyAsTechnician,
  getMyTechnicianProfile,
  getTechnicianById,
  getTechnicians,
  removeMySkill,
  reviewTechnician,
  updateMyAvailability,
} from "@/api";
import { technicianKeys } from "@/constants";
import type { ReviewTechnicianPayload, TechnicianListParams } from "@/types";

export function useApplyAsTechnician() {
  return useMutation({ mutationFn: applyAsTechnician });
}

export function useGetTechnicians(
  params?: TechnicianListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: technicianKeys.list(params),
    queryFn: () => getTechnicians(params),
    enabled: options?.enabled ?? true,
    placeholderData: keepPreviousData,
  });
}

export function useGetTechnician(id: string | null) {
  return useQuery({
    queryKey: technicianKeys.detail(id ?? ""),
    queryFn: () => getTechnicianById(id as string),
    enabled: Boolean(id),
    retry: false,
  });
}

export function useReviewTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReviewTechnicianPayload;
    }) => reviewTechnician(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: technicianKeys.all });
    },
  });
}

export function useGetMyTechnicianProfile() {
  return useQuery({
    queryKey: technicianKeys.mySkills,
    queryFn: getMyTechnicianProfile,
    retry: false,
  });
}

export function useUpdateMyAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: technicianKeys.mySkills });
    },
  });
}

function useMySkillMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: technicianKeys.mySkills });
    },
  });
}

export function useAddMySkill() {
  return useMySkillMutation(addMySkill);
}

export function useRemoveMySkill() {
  return useMySkillMutation(removeMySkill);
}
