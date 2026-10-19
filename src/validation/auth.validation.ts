import z from "zod";

// backend (auth.validation.ts) এর password rule এর সাথে হুবহু মিল
const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/[0-9]/, "Password must contain at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character");

// Bangladeshi number: +880 / 880 / 0 দিয়ে শুরু, তারপর 1[3-9] + ৮ digit
const bdPhoneRegex = /^(?:\+?880|0)1[3-9]\d{8}$/;

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),
  // login এ শুধু খালি কিনা দেখি; complexity rule register/reset এ আছে
  password: z.string().min(1, "Password is required"),
});

export const customerRegistrationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long"),
    email: z.email("Please enter a valid email"),
    contactNumber: z
      .string()
      .trim()
      .refine((val) => val === "" || bdPhoneRegex.test(val), {
        message: "Please provide a valid Bangladeshi number",
      }),
    password: passwordRule,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    otp: z.string().length(6, "OTP must be 6 digits"),
    newPassword: passwordRule,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type CustomerRegistrationFormValues = z.infer<
  typeof customerRegistrationSchema
>;
