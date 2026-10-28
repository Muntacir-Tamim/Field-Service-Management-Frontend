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
import { createServerSession, endSession, startSession } from "@/lib/session";

export function useGetMe() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: async () => {
      try {
        const res = await getMe();
        startSession(res.data);
        return res;
      } catch (err) {
        await endSession();
        throw err;
      }
    },
    retry: false,
  });
}

function useSessionMutation<TVariables>(
  mutationFn: (
    variables: TVariables,
  ) => Promise<{ data: { accessToken: string } }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const tokens = await mutationFn(variables);
      // server verifies the token with the backend, then sets the signed cookie
      await createServerSession(tokens.data.accessToken);
      return getMe();
    },
    onSuccess: (me) => {
      startSession(me.data);
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

    onSettled: async () => {
      await endSession();
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
