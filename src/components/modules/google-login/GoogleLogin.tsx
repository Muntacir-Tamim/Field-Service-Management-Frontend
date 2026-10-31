"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useGoogleOAuth } from "@/hooks";
import { getDashboardPath } from "@/lib/auth-redirect";
import { getErrorMessage } from "@/utils";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-[18px]" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default function GoogleLoginComponent() {
  const router = useRouter();
  const { mutate: googleLogin } = useGoogleOAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  // Google's real button is an iframe (max 400px), so we size it to the container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(Math.min(Math.floor(el.offsetWidth), 400));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  // Our own button is what the user SEES (always the same look).
  // Google's real button is rendered on top, invisible, so the click still
  // goes to Google and we still get the idToken (no backend change needed).
  return (
    <div ref={containerRef} className="group/google relative w-full">
      <Button
        type="button"
        variant="outline"
        size="lg"
        tabIndex={-1}
        aria-hidden="true"
        className="h-10 w-full gap-2 rounded-full group-hover/google:bg-muted"
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <div className="absolute inset-0 flex cursor-pointer justify-center overflow-hidden opacity-0">
        {width > 0 && (
          <GoogleLogin
            theme="outline"
            shape="pill"
            size="large"
            text="continue_with"
            width={width}
            onSuccess={handleSuccess}
            onError={() =>
              toast.add({
                title: "Google login failed",
                description: "Something went wrong. Please try again",
                type: "error",
              })
            }
          />
        )}
      </div>
    </div>
  );
}
