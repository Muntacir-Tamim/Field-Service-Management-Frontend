import z from "zod";

// backend (feedback.validation.ts) এর rule এর সাথে মিল:
// rating 1-5 পূর্ণ সংখ্যা, comment সর্বোচ্চ 1000 অক্ষর (ঐচ্ছিক)।
// rating form এ number; comment খালি রাখা যায়।

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
