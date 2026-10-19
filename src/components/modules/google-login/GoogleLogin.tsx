"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks";
import { getDashboardPath } from "@/lib/auth-redirect";
import { getErrorMessage } from "@/utils";

export default function GoogleLoginComponent() {
  const router = useRouter();
  const { mutate: googleLogin } = useGoogleOAuth();

  // Google client id না থাকলে provider বসে না; button দেখালে crash করবে
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  const handleSuccess = (credentialResponse: { credential?: string }) => {
    const idToken = credentialResponse.credential;

    if (!idToken) {
      toast.add({
        title: "Google login failed",
        description: "Could not get Google credential. Please try again",
        type: "error",
      });
      return;
    }

    googleLogin(
      { idToken },
      {
        onSuccess: (res) => {
          toast.add({
            title: "Logged in successfully",
            description: "Welcome back",
            type: "success",
          });
          router.replace(getDashboardPath(res.data.role));
        },
        onError: (err) => {
          toast.add({
            title: "Google login failed",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <GoogleLogin
      theme="outline"
      shape="pill"
      text="continue_with"
      onSuccess={handleSuccess}
      onError={() =>
        toast.add({
          title: "Google login failed",
          description: "Something went wrong. Please try again",
          type: "error",
        })
      }
    />
  );
}
