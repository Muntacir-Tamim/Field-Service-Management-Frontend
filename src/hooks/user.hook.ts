import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile, uploadProfileImage } from "@/api";
import { authKeys, userKeys } from "@/constants";

export function useGetMyProfile() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: getMyProfile,
  });
}

function useProfileMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.me });
      queryClient.invalidateQueries({ queryKey: userKeys.me });
    },
  });
}

export function useUpdateMyProfile() {
  return useProfileMutation(updateMyProfile);
}

export function useUploadProfileImage() {
  return useProfileMutation(uploadProfileImage);
}
