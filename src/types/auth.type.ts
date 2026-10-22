export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  customer?: {
    contactNumber?: string;
  };
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface GoogleOAuthPayload {
  idToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  otp: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
