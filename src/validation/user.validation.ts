import z from "zod";

const name = z
  .string()
  .trim()
  .min(3, "Name must be at least 3 characters")
  .max(50, "Name must be at most 50 characters");

const contactNumber = z
  .string()
  .trim()
  .refine((value) => value === "" || /^\+?[0-9\s-]{6,20}$/.test(value), {
    message: "Contact number is not valid",
  });

const gender = z.enum(["", "MALE", "FEMALE", "OTHER"]);

export const myProfileSchema = z.object({
  name,
  contactNumber,
  gender,
  address: z.string().trim().max(200, "Address must be at most 200 characters"),
  city: z.string().trim().max(100, "City must be at most 100 characters"),
  bio: z.string().trim().max(500, "Bio must be at most 500 characters"),
  experienceYears: z
    .string()
    .trim()
    .regex(/^\d+$/, "Enter a whole number (0 or more)")
    .refine((value) => Number(value) <= 60, {
      message: "Experience cannot be more than 60 years",
    }),
  department: z
    .string()
    .trim()
    .max(100, "Department must be at most 100 characters"),
});

export type MyProfileFormValues = z.infer<typeof myProfileSchema>;

export const PROFILE_IMAGE_MAX_MB = 5;
export const PROFILE_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
