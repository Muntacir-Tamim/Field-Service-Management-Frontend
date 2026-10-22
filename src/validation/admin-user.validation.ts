import z from "zod";

// backend (admin-user.validation.ts): BLOCKED করতে reason 5-300 অক্ষর
export const blockUserSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(5, "Reason is required (at least 5 characters)")
    .max(300, "Reason must be at most 300 characters"),
});

export type BlockUserFormValues = z.infer<typeof blockUserSchema>;
