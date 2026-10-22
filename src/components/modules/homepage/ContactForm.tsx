"use client";

import { useForm } from "@tanstack/react-form";
import z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SITE } from "@/constants";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.email("Enter a valid email address"),
  subject: z.string().trim().min(3, "Please add a subject"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be at most 2000 characters"),
});

export default function ContactForm() {
  const form = useForm({
    defaultValues: { name: "", email: "", subject: "", message: "" },
    validators: { onSubmit: contactSchema },
    onSubmit: ({ value }) => {
      const body = `${value.message.trim()}\n\n— ${value.name.trim()} (${value.email})`;
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
        value.subject.trim(),
      )}&body=${encodeURIComponent(body)}`;
    },
  });

  const textField = (
    name: "name" | "email" | "subject",
    label: string,
    type = "text",
    placeholder?: string,
  ) => (
    <form.Field name={name}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              type={type}
              placeholder={placeholder}
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
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          {textField("name", "Your name", "text", "Rahim Uddin")}
          {textField("email", "Email", "email", "you@example.com")}
        </div>
        {textField("subject", "Subject")}
        <form.Field name="message">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={5}
                  maxLength={2000}
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
        <div className="space-y-2">
          <Button type="submit">Open in my email app</Button>
          <FieldDescription>
            This opens your email app with the message ready to send to{" "}
            {SITE.email}.
          </FieldDescription>
        </div>
      </FieldGroup>
    </form>
  );
}
