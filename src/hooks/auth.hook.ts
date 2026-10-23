import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  getMe,
  googleOAuth,
  resendTechnicianOtp,
  resetPassword,
  userLogin,
  userLogout,
  userRegistration,
  verifyAccount,
  verifyTechnicianAccount,
} from "@/api";
import { authKeys } from "@/constants";

export function useGetMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: getMe,
    retry: false,
  });
}

function useSessionMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<unknown>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      await mutationFn(variables);
      return getMe();
    },
    onSuccess: (me) => {
      queryClient.setQueryData(authKeys.me, me);
    },
  });
}

export function useLogin() {
  return useSessionMutation(userLogin);
}

export function useGoogleOAuth() {
  return useSessionMutation(googleOAuth);
}

export function useVerifyAccount() {
  return useMutation({ mutationFn: verifyAccount });
}

export function useRegistration() {
  return useMutation({ mutationFn: userRegistration });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userLogout,

    onSettled: () => {
      queryClient.clear();
    },
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: resetPassword });
}

export function useVerifyTechnicianAccount() {
  return useMutation({ mutationFn: verifyTechnicianAccount });
}

export function useResendTechnicianOtp() {
  return useMutation({ mutationFn: resendTechnicianOtp });
}
