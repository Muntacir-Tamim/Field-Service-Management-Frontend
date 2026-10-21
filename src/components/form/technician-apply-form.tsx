"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/assets/svg/Logo";
import FileDropzone from "@/components/common/file-dropzone";
import PasswordInput from "@/components/common/password-input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useApplyAsTechnician, useGetSkills } from "@/hooks";
import type { Gender, Skill, SkillLevel } from "@/types";
import { getErrorMessage } from "@/utils";
import {
  type TechnicianApplicationFormValues,
  technicianApplicationSchema,
} from "@/validation";

const MAX_SKILLS = 15;
const MAX_DOCUMENTS = 5;
const FILE_ACCEPT = "application/pdf,image/jpeg,image/png,image/webp";
const FILE_MAX_MB = 5;

const GENDER_ITEMS = [
  { value: "", label: "Prefer not to say" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

const LEVEL_ITEMS: { value: SkillLevel; label: string }[] = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "EXPERT", label: "Expert" },
];

const defaultValues: TechnicianApplicationFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  contactNumber: "",
  gender: "",
  address: "",
  bio: "",
  experienceYears: "0",
  skills: [],
  resume: [],
  documents: [],
};

// skill গুলো category অনুযায়ী ভাগ করে দেখাই
function groupByCategory(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    const list = groups.get(skill.category) ?? [];
    list.push(skill);
    groups.set(skill.category, list);
  }
  return Array.from(groups.entries());
}

// /apply : technician হওয়ার আবেদন form
export default function TechnicianApplyForm() {
  const router = useRouter();
  const { mutate: apply, isPending } = useApplyAsTechnician();
  const {
    data: skillsData,
    isPending: skillsPending,
    isError: skillsError,
    refetch: refetchSkills,
  } = useGetSkills();

  const skillGroups = groupByCategory(skillsData?.data ?? []);

  const form = useForm({
    defaultValues,
    validators: { onSubmit: technicianApplicationSchema },
    onSubmit: ({ value }) => {
      const email = value.email.trim();
      const address = value.address.trim();
      const bio = value.bio.trim();

      apply(
        {
          data: {
            name: value.name.trim(),
            email,
            password: value.password,
            technician: {
              contactNumber: value.contactNumber.trim(),
              experienceYears: Number(value.experienceYears),
              // ফাঁকা field পাঠাই না
              ...(value.gender && { gender: value.gender as Gender }),
              ...(address && { address }),
              ...(bio && { bio }),
            },
            skills: value.skills,
          },
          resume: value.resume[0] ?? null,
          documents: value.documents,
        },
        {
          onSuccess: () => {
            toast.add({
              title: "Application submitted",
              description: "We sent an OTP to your email. Please verify",
              type: "success",
            });
            const params = new URLSearchParams({ email });
            router.push(`/apply/verify-account?${params.toString()}`);
          },
          onError: (err) => {
            toast.add({
              title: "Could not submit application",
              description: getErrorMessage(err),
              type: "error",
            });
          },
        },
      );
    },
  });

  return (
    <div className="min-h-svh bg-muted/30">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8 md:py-12">
        <Link href="/" className="flex items-center gap-2 font-medium">
          <Logo />
          <span>FSM</span>
        </Link>

        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Apply as a technician
          </h1>
          <p className="text-sm text-muted-foreground">
            Fill in your details and skills. Our team will review your
            application after you verify your email.
          </p>
        </div>

        <form
          className="flex flex-col gap-8 rounded-xl border bg-background p-4 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {/* Account */}
          <FieldSet>
            <FieldLegend>Account</FieldLegend>
            <FieldGroup>
              <form.Field name="name">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Full name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="John Doe"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="name"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="email">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="m@example.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        autoComplete="email"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <PasswordInput
                          id={field.name}
                          name={field.name}
                          placeholder="*********"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="new-password"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="confirmPassword">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Confirm password
                        </FieldLabel>
                        <PasswordInput
                          id={field.name}
                          name={field.name}
                          placeholder="*********"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="new-password"
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
          </FieldSet>

          {/* Profile */}
          <FieldSet>
            <FieldLegend>Profile</FieldLegend>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="contactNumber">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Contact number
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="tel"
                          placeholder="01712345678"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="tel"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="gender">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>
                        Gender (optional)
                      </FieldLabel>
                      <Select
                        items={GENDER_ITEMS}
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(
                            (value ??
                              "") as TechnicianApplicationFormValues["gender"],
                          )
                        }
                      >
                        <SelectTrigger id={field.name} className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                          {GENDER_ITEMS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                </form.Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="address">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Address (optional)
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="House, road, area, city"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
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

                <form.Field name="experienceYears">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Years of experience
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="number"
                          inputMode="numeric"
                          min={0}
                          max={60}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <form.Field name="bio">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Short bio (optional)
                      </FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        rows={4}
                        placeholder="Tell us about your work and experience"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />
                      <FieldDescription>
                        {field.state.value.length}/500
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </FieldSet>

          {/* Skills */}
          <form.Field name="skills">
            {(field) => {
              const selected = field.state.value;
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              const toggle = (skillId: string, checked: boolean) => {
                if (checked) {
                  if (selected.length >= MAX_SKILLS) {
                    toast.add({
                      title: `You can select up to ${MAX_SKILLS} skills`,
                      type: "error",
                    });
                    return;
                  }
                  field.handleChange([
                    ...selected,
                    { skillId, level: "INTERMEDIATE" },
                  ]);
                } else {
                  field.handleChange(
                    selected.filter((item) => item.skillId !== skillId),
                  );
                }
                field.handleBlur();
              };

              const setLevel = (skillId: string, level: SkillLevel) => {
                field.handleChange(
                  selected.map((item) =>
                    item.skillId === skillId ? { ...item, level } : item,
                  ),
                );
              };

              return (
                <FieldSet data-invalid={isInvalid}>
                  <FieldLegend>Skills</FieldLegend>
                  <FieldDescription>
                    Select what you can do and your level for each (
                    {selected.length}/{MAX_SKILLS} selected).
                  </FieldDescription>

                  {skillsPending ? (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ) : skillsError ? (
                    <div className="flex items-center gap-3 text-sm text-destructive">
                      Could not load skills.
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => refetchSkills()}
                      >
                        Try again
                      </Button>
                    </div>
                  ) : skillGroups.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No skills are available yet. Please try again later.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {skillGroups.map(([category, skills]) => (
                        <div key={category} className="flex flex-col gap-2">
                          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                            {category}
                          </p>
                          <div className="flex flex-col gap-1">
                            {skills.map((skill) => {
                              const current = selected.find(
                                (item) => item.skillId === skill.id,
                              );
                              const checkboxId = `skill-${skill.id}`;
                              return (
                                <div
                                  key={skill.id}
                                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2"
                                >
                                  <div className="flex items-center gap-2">
                                    <Checkbox
                                      id={checkboxId}
                                      checked={Boolean(current)}
                                      onCheckedChange={(checked) =>
                                        toggle(skill.id, checked)
                                      }
                                    />
                                    <label
                                      htmlFor={checkboxId}
                                      className="cursor-pointer text-sm"
                                    >
                                      {skill.name}
                                    </label>
                                  </div>
                                  {current ? (
                                    <Select
                                      items={LEVEL_ITEMS}
                                      value={current.level}
                                      onValueChange={(value) =>
                                        setLevel(
                                          skill.id,
                                          (value as SkillLevel) ??
                                            "INTERMEDIATE",
                                        )
                                      }
                                    >
                                      <SelectTrigger
                                        aria-label={`${skill.name} level`}
                                        className="w-36"
                                      >
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent
                                        alignItemWithTrigger={false}
                                      >
                                        {LEVEL_ITEMS.map((item) => (
                                          <SelectItem
                                            key={item.value}
                                            value={item.value}
                                          >
                                            {item.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  ) : null}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              );
            }}
          </form.Field>

          {/* Documents */}
          <FieldSet>
            <FieldLegend>Documents</FieldLegend>
            <FieldGroup>
              <form.Field name="resume">
                {(field) => (
                  <Field>
                    <FieldLabel>Resume / CV (optional)</FieldLabel>
                    <FileDropzone
                      value={field.state.value}
                      onChange={field.handleChange}
                      accept={FILE_ACCEPT}
                      maxSizeMB={FILE_MAX_MB}
                      disabled={isPending}
                      hint={`PDF or image, up to ${FILE_MAX_MB} MB`}
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="documents">
                {(field) => (
                  <Field>
                    <FieldLabel>
                      Certificates and other documents (optional)
                    </FieldLabel>
                    <FileDropzone
                      multiple
                      value={field.state.value}
                      onChange={field.handleChange}
                      accept={FILE_ACCEPT}
                      maxFiles={MAX_DOCUMENTS}
                      maxSizeMB={FILE_MAX_MB}
                      disabled={isPending}
                      hint={`PDF or image, up to ${MAX_DOCUMENTS} files, ${FILE_MAX_MB} MB each`}
                    />
                  </Field>
                )}
              </form.Field>
            </FieldGroup>
          </FieldSet>

          <Button disabled={isPending} type="submit">
            {isPending ? (
              <>
                <Spinner /> Submitting application
              </>
            ) : (
              "Submit application"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
