import z from "zod";

// backend (Assignment.validation.ts + service) এর rule:
// end > start, start ভবিষ্যতে, একটা visit সর্বোচ্চ ১২ ঘণ্টা
export const MAX_VISIT_HOURS = 12;

// <input type="datetime-local"> এর value ("2026-10-21T14:30") থেকে Date
export function parseLocalDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// backend এ ISO string পাঠাই
export function toIsoString(value: string) {
  return (parseLocalDateTime(value) as Date).toISOString();
}

const scheduleFields = {
  scheduledStart: z.string().min(1, "Start time is required"),
  scheduledEnd: z.string().min(1, "End time is required"),
};

function validateWindow(
  data: { scheduledStart: string; scheduledEnd: string },
  ctx: z.RefinementCtx,
) {
  const start = parseLocalDateTime(data.scheduledStart);
  const end = parseLocalDateTime(data.scheduledEnd);

  if (!start) {
    return;
  }
  if (start <= new Date()) {
    ctx.addIssue({
      code: "custom",
      path: ["scheduledStart"],
      message: "Start time must be in the future",
    });
  }
  if (!end) {
    return;
  }
  if (end <= start) {
    ctx.addIssue({
      code: "custom",
      path: ["scheduledEnd"],
      message: "End time must be after the start time",
    });
    return;
  }
  const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  if (hours > MAX_VISIT_HOURS) {
    ctx.addIssue({
      code: "custom",
      path: ["scheduledEnd"],
      message: `A visit cannot be longer than ${MAX_VISIT_HOURS} hours`,
    });
  }
}

export const createAssignmentSchema = z
  .object({
    ...scheduleFields,
    technicianId: z.string().min(1, "Please select a technician"),
    notes: z.string().trim().max(500, "Notes must be at most 500 characters"),
  })
  .superRefine(validateWindow);

export const rescheduleAssignmentSchema = z
  .object({
    ...scheduleFields,
    // ফাঁকা মানে বর্তমান technician ই থাকবে
    technicianId: z.string(),
    reason: z.string().trim().max(300, "Reason must be at most 300 characters"),
    notes: z.string().trim().max(500, "Notes must be at most 500 characters"),
  })
  .superRefine(validateWindow);

export const cancelAssignmentSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(3, "Please give a reason (at least 3 characters)")
    .max(300, "Reason must be at most 300 characters"),
});

export type CreateAssignmentFormValues = z.infer<typeof createAssignmentSchema>;
export type RescheduleAssignmentFormValues = z.infer<
  typeof rescheduleAssignmentSchema
>;
export type CancelAssignmentFormValues = z.infer<typeof cancelAssignmentSchema>;
