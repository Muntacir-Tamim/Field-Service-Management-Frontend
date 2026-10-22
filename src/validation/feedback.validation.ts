import z from "zod";

export const feedbackSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Please select a rating")
    .max(5, "Rating must be at most 5"),
  comment: z
    .string()
    .trim()
    .max(1000, "Comment must be at most 1000 characters"),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export const FEEDBACK_COMMENT_MAX = 1000;
