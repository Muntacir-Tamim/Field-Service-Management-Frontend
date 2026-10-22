import z from "zod";

export const serviceRequestSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be at most 2000 characters"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),

  preferredDate: z
    .date()
    .optional()
    .refine(
      (date) => {
        if (!date) {
          return true;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      { message: "Preferred date cannot be in the past" },
    ),
  address: z.string().trim().min(1, "Address is required"),
  city: z.string().trim().min(1, "City is required"),

  attachments: z
    .array(z.instanceof(File))
    .max(5, "You can attach up to 5 files"),
});

export type ServiceRequestFormValues = z.infer<typeof serviceRequestSchema>;

export const rejectServiceRequestSchema = z.object({
  rejectionReason: z
    .string()
    .trim()
    .min(5, "Please give a reason (at least 5 characters)")
    .max(500, "Reason must be at most 500 characters"),
});

export type RejectServiceRequestFormValues = z.infer<
  typeof rejectServiceRequestSchema
>;
