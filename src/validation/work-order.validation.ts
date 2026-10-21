import z from "zod";

// backend (work-order.validation.ts) এর rule এর সাথে মিল।
// number input এর value string; submit এর সময় Number() করা হয়।

export const startWorkSchema = z.object({
  problemFound: z
    .string()
    .trim()
    .min(3, "Describe the problem you found (at least 3 characters)")
    .max(1000, "Must be at most 1000 characters"),
  workDescription: z
    .string()
    .trim()
    .min(3, "Describe the work you will do (at least 3 characters)")
    .max(2000, "Must be at most 2000 characters"),
});

export const completeWorkSchema = z.object({
  laborHours: z
    .string()
    .trim()
    .refine((value) => value !== "" && Number(value) > 0, {
      message: "Labor hours must be greater than 0",
    })
    .refine((value) => Number(value) <= 100, {
      message: "Labor hours looks too large (max 100)",
    }),
  completionNotes: z
    .string()
    .trim()
    .min(3, "Completion notes are required (at least 3 characters)")
    .max(2000, "Must be at most 2000 characters"),
  // শুধু image; type/size FileDropzone এ যাচাই হয়
  completionImage: z.array(z.instanceof(File)).max(1),
});

export const addPartSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Part name is required")
    .max(150, "Part name must be at most 150 characters"),
  quantity: z
    .string()
    .trim()
    .regex(/^\d+$/, "Enter a whole number")
    .refine((value) => Number(value) >= 1 && Number(value) <= 10000, {
      message: "Quantity must be between 1 and 10000",
    }),
  unitCost: z
    .string()
    .trim()
    .refine((value) => value !== "" && Number(value) >= 0, {
      message: "Enter a valid cost (0 or more)",
    })
    .refine((value) => Number(value) <= 99999999, {
      message: "Cost is too large",
    }),
  notes: z.string().trim().max(300, "Notes must be at most 300 characters"),
});

export const serviceReportSchema = z.object({
  summary: z
    .string()
    .trim()
    .min(5, "Summary is required (at least 5 characters)")
    .max(1000, "Summary must be at most 1000 characters"),
  findings: z
    .string()
    .trim()
    .min(5, "Findings are required (at least 5 characters)")
    .max(3000, "Findings must be at most 3000 characters"),
  recommendations: z
    .string()
    .trim()
    .max(2000, "Recommendations must be at most 2000 characters"),
});

export type StartWorkFormValues = z.infer<typeof startWorkSchema>;
export type CompleteWorkFormValues = z.infer<typeof completeWorkSchema>;
export type AddPartFormValues = z.infer<typeof addPartSchema>;
export type ServiceReportFormValues = z.infer<typeof serviceReportSchema>;

// attachment / completion image এর limit (backend: ৫ MB, PDF/JPG/PNG/WEBP)
export const WORK_ORDER_FILE_MAX_MB = 5;
export const WORK_ORDER_FILE_ACCEPT =
  "application/pdf,image/jpeg,image/png,image/webp";
export const WORK_ORDER_MAX_ATTACHMENTS_PER_UPLOAD = 5;
