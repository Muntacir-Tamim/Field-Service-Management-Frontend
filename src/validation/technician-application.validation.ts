import z from "zod";

// backend (Technician.validation.ts) এর password rule এর সাথে হুবহু মিল
const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
  .regex(/[0-9]/, "Password must contain at least 1 number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character");

export const technicianApplicationSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long"),
    email: z.email("Please enter a valid email"),
    password: passwordRule,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    contactNumber: z
      .string()
      .trim()
      .min(6, "Contact number is required")
      .max(20, "Contact number must be at most 20 characters"),
    gender: z.enum(["", "MALE", "FEMALE", "OTHER"]),
    address: z
      .string()
      .trim()
      .max(200, "Address must be at most 200 characters"),
    bio: z.string().trim().max(500, "Bio must be at most 500 characters"),
    // number input এর value string; submit এর সময় number এ বদলানো হয়
    experienceYears: z
      .string()
      .trim()
      .regex(/^\d+$/, "Enter a whole number (0 or more)")
      .refine((value) => Number(value) <= 60, {
        message: "Experience cannot be more than 60 years",
      }),
    skills: z
      .array(
        z.object({
          skillId: z.string().min(1),
          level: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"]),
        }),
      )
      .min(1, "Select at least 1 skill")
      .max(15, "You can select at most 15 skills"),
    // ফাইলের type/size FileDropzone এ যাচাই হয়; এখানে শুধু সংখ্যা
    resume: z.array(z.instanceof(File)).max(1),
    documents: z
      .array(z.instanceof(File))
      .max(5, "You can upload up to 5 documents"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type TechnicianApplicationFormValues = z.infer<
  typeof technicianApplicationSchema
>;
