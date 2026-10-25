"use client";

import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { CalendarIcon, CheckIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FileDropzone from "@/components/common/file-dropzone";
import PageHeader from "@/components/common/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import {
  PRIORITY_OPTIONS,
  REQUEST_ATTACHMENT_ACCEPT,
  REQUEST_MAX_ATTACHMENTS,
  REQUEST_MAX_FILE_MB,
} from "@/constants";
import { useCreateServiceRequest, useGetMe } from "@/hooks";
import { cn } from "@/lib/utils";
import { CUSTOMER_ROUTES } from "@/routes";
import type { Priority } from "@/types";
import { getErrorMessage } from "@/utils";
import {
  type ServiceRequestFormValues,
  serviceRequestSchema,
} from "@/validation";

type StepField =
  | "title"
  | "description"
  | "priority"
  | "preferredDate"
  | "address"
  | "city"
  | "attachments";

/** Wizard steps; each step validates only its own fields before moving on. */
const STEPS: { label: string; fields: StepField[] }[] = [
  { label: "Problem", fields: ["title", "description", "priority"] },
  { label: "Location", fields: ["preferredDate", "address", "city"] },
  { label: "Attachments & review", fields: ["attachments"] },
];

// /dashboard/service-requests/new  (3-step wizard)
export default function ServiceRequestForm() {
  const router = useRouter();
  const { data: me } = useGetMe();
  const { mutate: create, isPending } = useCreateServiceRequest();

  const customer = me?.data.customer;
  const [step, setStep] = useState(0);
  const isLastStep = step === STEPS.length - 1;

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      priority: "MEDIUM",
      preferredDate: undefined,

      address: customer?.address ?? "",
      city: customer?.city ?? "",
      attachments: [],
    } as ServiceRequestFormValues,
    validators: {
      onChange: serviceRequestSchema,
      onSubmit: serviceRequestSchema,
    },
    onSubmit: ({ value }) => {
      create(
        {
          title: value.title.trim(),
          description: value.description.trim(),
          priority: value.priority,
          preferredDate: value.preferredDate
            ? format(value.preferredDate, "yyyy-MM-dd")
            : undefined,
          address: value.address.trim(),
          city: value.city.trim(),
          attachments: value.attachments,
        },
        {
          onSuccess: (res) => {
            toast.add({
              title: "Request submitted",
              description: "We will review it shortly",
              type: "success",
            });
            router.replace(`${CUSTOMER_ROUTES.serviceRequests}/${res.data.id}`);
          },
          onError: (err) => {
            toast.add({
              title: "Could not submit request",
              description: getErrorMessage(err),
              type: "error",
            });
          },
        },
      );
    },
  });

  const goNext = async () => {
    // Run the schema, mark this step's fields as touched so errors show,
    // and only continue when every field of the step is valid.
    await form.validate("change");
    for (const name of STEPS[step].fields) {
      form.setFieldMeta(name, (meta) => ({ ...meta, isTouched: true }));
    }
    const valid = STEPS[step].fields.every(
      (name) => form.getFieldMeta(name)?.isValid !== false,
    );
    if (valid) {
      setStep((current) => Math.min(current + 1, STEPS.length - 1));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <PageHeader
        title="New service request"
        description="Tell us what needs fixing. Photos or a PDF help our team understand the job."
        backHref={CUSTOMER_ROUTES.serviceRequests}
        backLabel="My requests"
      />

      <ol className="flex items-center gap-2 text-sm" aria-label="Progress">
        {STEPS.map((item, index) => {
          const done = index < step;
          const active = index === step;
          return (
            <li
              key={item.label}
              className="flex flex-1 items-center gap-2"
              aria-current={active ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  active && "border-primary bg-primary text-primary-foreground",
                  done && "border-primary text-primary",
                  !active && !done && "text-muted-foreground",
                )}
              >
                {done ? <CheckIcon className="size-3.5" /> : index + 1}
              </span>
              <span
                className={cn(
                  "hidden truncate sm:inline",
                  active ? "font-medium" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ol>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (isLastStep) {
            form.handleSubmit();
          } else {
            void goNext();
          }
        }}
      >
        <FieldGroup hidden={step !== 0}>
          <form.Field name="title">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. AC is not cooling"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="description">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={5}
                    placeholder="Describe the problem in a few sentences"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="priority">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Priority</FieldLabel>
                <Select
                  items={PRIORITY_OPTIONS}
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange((value as Priority) ?? "MEDIUM")
                  }
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent alignItemWithTrigger={false}>
                    {PRIORITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>
        </FieldGroup>

        <FieldGroup hidden={step !== 1}>
          <form.Field name="preferredDate">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Preferred date (optional)
                  </FieldLabel>
                  <Popover>
                    <PopoverTrigger
                      id={field.name}
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "h-8 w-full justify-start font-normal",
                        !field.state.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon />
                      {field.state.value
                        ? format(field.state.value, "dd MMM yyyy")
                        : "Pick a date"}
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.state.value}
                        onSelect={(date) => {
                          field.handleChange(date);
                          field.handleBlur();
                        }}
                        disabled={{ before: today }}
                      />
                    </PopoverContent>
                  </Popover>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <form.Field name="address">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="House, road, area"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      autoComplete="street-address"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="city">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>City</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Dhaka"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      autoComplete="address-level2"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </div>
        </FieldGroup>

        <FieldGroup hidden={step !== 2}>
          <form.Field name="attachments">
            {(field) => (
              <Field>
                <FieldLabel>Attachments (optional)</FieldLabel>
                <FileDropzone
                  multiple
                  value={field.state.value}
                  onChange={field.handleChange}
                  accept={REQUEST_ATTACHMENT_ACCEPT}
                  maxFiles={REQUEST_MAX_ATTACHMENTS}
                  maxSizeMB={REQUEST_MAX_FILE_MB}
                  disabled={isPending}
                  hint={`Images or PDF, up to ${REQUEST_MAX_ATTACHMENTS} files, ${REQUEST_MAX_FILE_MB} MB each`}
                />
                <FieldDescription>
                  Clear photos of the problem speed up the review.
                </FieldDescription>
              </Field>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.values}>
            {(values) => (
              <dl className="grid gap-2 rounded-lg border p-4 text-sm sm:grid-cols-[8rem_1fr]">
                <dt className="text-muted-foreground">Title</dt>
                <dd className="font-medium break-words">{values.title}</dd>
                <dt className="text-muted-foreground">Priority</dt>
                <dd>{values.priority}</dd>
                <dt className="text-muted-foreground">Preferred date</dt>
                <dd>
                  {values.preferredDate
                    ? format(values.preferredDate, "dd MMM yyyy")
                    : "Not set"}
                </dd>
                <dt className="text-muted-foreground">Location</dt>
                <dd className="break-words">
                  {values.address}, {values.city}
                </dd>
                <dt className="text-muted-foreground">Attachments</dt>
                <dd>{values.attachments.length} file(s)</dd>
              </dl>
            )}
          </form.Subscribe>
        </FieldGroup>

        <div className="mt-6 flex flex-wrap justify-between gap-2">
          {step === 0 ? (
            <Link
              href={CUSTOMER_ROUTES.serviceRequests}
              className={buttonVariants({ variant: "outline" })}
            >
              Cancel
            </Link>
          ) : (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
            >
              Back
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Spinner /> Submitting
              </>
            ) : isLastStep ? (
              "Submit request"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
