import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AuthTokens,
  ForgotPasswordPayload,
  GoogleOAuthPayload,
  LoginPayload,
  RegistrationPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  User,
  VerifyAccountPayload,
} from "@/types";

export function userLogin(payload: LoginPayload) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function userRegistration(payload: RegistrationPayload) {
  return apiClient<ApiResponse<null>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

// customer verify করলে backend নিজেই cookie set করে (auto login)
export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient<ApiResponse<unknown>>("/auth/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function getMe() {
  return apiClient<ApiResponse<User>>("/auth/me");
}

export function userLogout() {
  return apiClient<ApiResponse<null>>("/auth/logout", { method: "POST" });
}

export function googleOAuth(payload: GoogleOAuthPayload) {
  return apiClient<ApiResponse<AuthTokens>>("/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}

export function resetPassword(payload: ResetPasswordPayload) {
  return apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
}

// technician application এর email verify (account verify হলেও admin approve না করা পর্যন্ত pending)
export function verifyTechnicianAccount(payload: VerifyAccountPayload) {
  return apiClient<ApiResponse<unknown>>("/technicians/apply/verify-email", {
    method: "POST",
    body: payload,
  });
}

export function resendTechnicianOtp(payload: ResendOtpPayload) {
  return apiClient<ApiResponse<null>>("/technicians/apply/resend-otp", {
    method: "POST",
    body: payload,
  });
}
