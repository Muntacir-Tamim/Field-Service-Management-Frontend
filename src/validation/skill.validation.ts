import z from "zod";

export const skillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Skill name must be at least 2 characters")
    .max(60, "Skill name must be at most 60 characters"),
  category: z
    .string()
    .trim()
    .min(2, "Category must be at least 2 characters")
    .max(60, "Category must be at most 60 characters"),
  description: z
    .string()
    .trim()
    .max(300, "Description must be at most 300 characters"),
});

export type SkillFormValues = z.infer<typeof skillSchema>;
