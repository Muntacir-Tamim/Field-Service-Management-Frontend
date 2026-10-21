import z from "zod";

// backend (user.validation.ts) এর rule এর সাথে মিল।
// form এর সব field string; ফাঁকা মানে "বদলাচ্ছি না" (backend এ ফাঁকা string reject হয়)
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

// তিন role এর form একটাই schema ব্যবহার করে। যে field কোনো role এ দেখানো হয় না
// সেটা default (ফাঁকা / "0") থাকে, তাই সবসময় valid; আর submit এ পাঠানোই হয় না।
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

// ছবির limit (backend এ নির্দিষ্ট limit নেই; UI তে ৫ MB ধরা হলো)
export const PROFILE_IMAGE_MAX_MB = 5;
export const PROFILE_IMAGE_ACCEPT = "image/jpeg,image/png,image/webp";
