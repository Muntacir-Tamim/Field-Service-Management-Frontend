import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createSkill, deleteSkill, getSkills, updateSkill } from "@/api";
import { skillKeys } from "@/constants";
import type { SkillListParams, UpdateSkillPayload } from "@/types";

export function useGetSkills(params?: SkillListParams) {
  return useQuery({
    queryKey: skillKeys.list(params),
    queryFn: () => getSkills(params),
    // filter বদলালে আগের list দেখিয়ে রাখি, flicker হয় না
    placeholderData: keepPreviousData,
  });
}

// create / update / delete সবার পরে skill এর সব list refetch হয়
function useSkillMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: skillKeys.all });
    },
  });
}

export function useCreateSkill() {
  return useSkillMutation(createSkill);
}

export function useUpdateSkill() {
  return useSkillMutation(
    ({ id, payload }: { id: string; payload: UpdateSkillPayload }) =>
      updateSkill(id, payload),
  );
}

export function useDeleteSkill() {
  return useSkillMutation(deleteSkill);
}
