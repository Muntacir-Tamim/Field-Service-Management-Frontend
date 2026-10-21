"use client";

import { useForm } from "@tanstack/react-form";
import InfoRow from "@/components/common/info-row";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useSaveServiceReport } from "@/hooks";
import type { ServiceReport } from "@/types";
import { formatDateTime, getErrorMessage } from "@/utils";
import { serviceReportSchema } from "@/validation";

interface ServiceReportSectionProps {
  workOrderId: string;
  report: ServiceReport | null;
  // technician এবং status IN_PROGRESS / COMPLETED হলে true
  editable: boolean;
}

// technician লেখে/বদলায়; admin ও customer শুধু পড়ে
export default function ServiceReportSection({
  workOrderId,
  report,
  editable,
}: ServiceReportSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service report</CardTitle>
        <CardDescription>
          {report
            ? `Last updated ${formatDateTime(report.updatedAt)}`
            : editable
              ? "Required before the admin can verify this job."
              : "The technician has not submitted a report yet."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {editable ? (
          // report বদলালে (save এর পর refetch) form নতুন value নিয়ে শুরু হয়
          <ReportForm
            key={report?.updatedAt ?? "new"}
            workOrderId={workOrderId}
            report={report}
          />
        ) : report ? (
          <dl className="space-y-4">
            <InfoRow label="Summary">
              <span className="whitespace-pre-wrap">{report.summary}</span>
            </InfoRow>
            <InfoRow label="Findings">
              <span className="whitespace-pre-wrap">{report.findings}</span>
            </InfoRow>
            <InfoRow label="Recommendations">
              <span className="whitespace-pre-wrap">
                {report.recommendations ?? "—"}
              </span>
            </InfoRow>
          </dl>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ReportForm({
  workOrderId,
  report,
}: {
  workOrderId: string;
  report: ServiceReport | null;
}) {
  const { mutate: save, isPending } = useSaveServiceReport();

  const form = useForm({
    defaultValues: {
      summary: report?.summary ?? "",
      findings: report?.findings ?? "",
      recommendations: report?.recommendations ?? "",
    },
    validators: { onSubmit: serviceReportSchema },
    onSubmit: ({ value }) => {
      const recommendations = value.recommendations.trim();

      save(
        {
          id: workOrderId,
          payload: {
            summary: value.summary.trim(),
            findings: value.findings.trim(),
            ...(recommendations && { recommendations }),
          },
        },
        {
          onSuccess: () => {
            toast.add({
              title: report ? "Report updated" : "Report submitted",
              type: "success",
            });
          },
          onError: (err) => {
            toast.add({
              title: "Could not save report",
              description: getErrorMessage(err),
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <form.Field name="summary">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Summary</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  placeholder="A short summary of the job"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="findings">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Findings</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={5}
                  placeholder="What you found and what you did"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="recommendations">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Recommendations (optional)
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
                  placeholder="Follow-up advice for the customer"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Saving
              </>
            ) : report ? (
              "Update report"
            ) : (
              "Submit report"
            )}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
