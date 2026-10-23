"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import {
  useResendTechnicianOtp,
  useVerifyAccount,
  useVerifyTechnicianAccount,
} from "@/hooks";
import { getErrorMessage } from "@/utils";

const RESEND_COOLDOWN = 120;

interface IProps {
  mode?: "customer" | "technician";
}

export default function VerifyAccountForm({ mode = "customer" }: IProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  const { mutate: verifyCustomer, isPending: customerPending } =
    useVerifyAccount();
  const { mutate: verifyTechnician, isPending: technicianPending } =
    useVerifyTechnicianAccount();
  const { mutate: resendOtp, isPending: resendPending } =
    useResendTechnicianOtp();

  const isPending = customerPending || technicianPending;

  // email ছাড়া এই page এর কোনো মানে নেই
  useEffect(() => {
    if (!email) {
      router.replace(mode === "technician" ? "/apply" : "/register");
    }
  }, [email, mode, router]);

  // cooldown timer: resendTimer বদলালে নতুন timeout বসে, 0 হলে থেমে যায়
  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }
    const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleError = (err: unknown) => {
    toast.add({
      title: "Verification failed",
      description: getErrorMessage(err),
      type: "error",
    });
  };

  const handleSubmit = () => {
    if (otp.length !== 6) {
      setIsInvalid(true);
      return;
    }

    const payload = { email, otp };

    if (mode === "technician") {
      verifyTechnician(payload, {
        onSuccess: () => {
          toast.add({
            title: "Email verified",
            description:
              "Your application is now waiting for admin review. We will email you the result",
            type: "success",
          });
          router.replace("/");
        },
        onError: handleError,
      });
      return;
    }

    verifyCustomer(payload, {
      onSuccess: () => {
        toast.add({
          title: "Verification successful",
          description: "Please login to continue",
          type: "success",
        });
        router.replace("/login");
      },
      onError: handleError,
    });
  };

  const handleResend = () => {
    resendOtp(
      { email },
      {
        onSuccess: () => {
          setResendTimer(RESEND_COOLDOWN);
          toast.add({
            title: "OTP sent",
            description: "Please check your email",
            type: "success",
          });
        },
        onError: (err) => {
          toast.add({
            title: "Could not resend OTP",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  if (!email) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Account</CardTitle>
        <CardDescription>
          Enter the 6 digit OTP we sent to {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="otp-form"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit();
          }}
        >
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor="otp">OTP</FieldLabel>
            <InputOTP
              maxLength={6}
              onChange={(value) => {
                setOtp(value);
                if (isInvalid) {
                  setIsInvalid(false);
                }
              }}
              value={otp}
              autoComplete="off"
              name="otp"
              id="otp"
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {isInvalid && (
              <FieldError
                errors={[{ message: "Please enter the 6 digit code" }]}
              />
            )}
            {mode === "technician" ? (
              <FieldDescription>
                {resendTimer > 0
                  ? `Resend available in ${resendTimer}s`
                  : "Didn't get the code? You can resend it now"}
              </FieldDescription>
            ) : (
              <FieldDescription>
                The OTP expires in 5 minutes. If it expired,{" "}
                <Link href="/register" className="underline">
                  register again
                </Link>
                .
              </FieldDescription>
            )}
          </Field>
        </form>
      </CardContent>
      <CardFooter className="gap-2">
        {mode === "technician" && (
          <Button
            type="button"
            variant="outline"
            disabled={resendTimer > 0 || resendPending}
            onClick={handleResend}
          >
            {resendPending ? <Spinner /> : "Resend"}
          </Button>
        )}
        <Button type="submit" form="otp-form" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner /> Verifying
            </>
          ) : (
            "Verify"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
