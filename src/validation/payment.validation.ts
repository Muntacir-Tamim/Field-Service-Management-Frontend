import z from "zod";

export const refundSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Refund reason is required (at least 3 characters)")
    .max(300, "Reason must be at most 300 characters"),
});

export const createInvoiceSchema = z.object({
  workOrderId: z.string().trim().min(1, "Work order is required"),
  discount: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" || (Number(value) >= 0 && Number(value) <= 99999999),
      { message: "Enter a valid discount (0 or more)" },
    ),
  taxPercent: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || (Number(value) >= 0 && Number(value) <= 100),
      { message: "Tax must be between 0 and 100" },
    ),
  dueDate: z.string().trim(),
  notes: z.string().trim().max(500, "Notes must be at most 500 characters"),
});

export type RefundFormValues = z.infer<typeof refundSchema>;
export type CreateInvoiceFormValues = z.infer<typeof createInvoiceSchema>;
