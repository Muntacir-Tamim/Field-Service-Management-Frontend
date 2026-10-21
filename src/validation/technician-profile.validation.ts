import z from "zod";

// ADMIN: application review (backend: REJECTED হলে reason min 5, max 300)
export const reviewTechnicianSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(5, "Please give a reason (at least 5 characters)")
    .max(300, "Reason must be at most 300 characters"),
});

export type ReviewTechnicianFormValues = z.infer<typeof reviewTechnicianSchema>;

// TECHNICIAN: নিজের skill যোগ
export const addMySkillSchema = z.object({
  skillId: z.string().min(1, "Please select a skill"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"]),
});

export type AddMySkillFormValues = z.infer<typeof addMySkillSchema>;
