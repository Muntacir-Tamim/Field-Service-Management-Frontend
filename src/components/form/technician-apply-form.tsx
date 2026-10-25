"use client";

import { useForm } from "@tanstack/react-form";
import {
  BadgeCheckIcon,
  BriefcaseIcon,
  ClipboardListIcon,
  FileTextIcon,
  type LucideIcon,
  MailCheckIcon,
  SearchIcon,
  UserIcon,
  WrenchIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import FileDropzone from "@/components/common/file-dropzone";
import PasswordInput from "@/components/common/password-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { SKILL_CATEGORIES } from "@/constants";
import { useApplyAsTechnician, useGetSkills } from "@/hooks";
import { cn } from "@/lib/utils";
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

const PROCESS_STEPS = [
  {
    icon: ClipboardListIcon,
    title: "Submit your application",
    description: "Share your details, skills and supporting documents.",
  },
  {
    icon: MailCheckIcon,
    title: "Verify your email",
    description: "We send a one-time code to confirm your email address.",
  },
  {
    icon: BadgeCheckIcon,
    title: "Get reviewed and approved",
    description: "Our team reviews your profile and activates your account.",
  },
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

function groupByCategory(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();

  for (const skill of skills) {
    const list = groups.get(skill.category) ?? [];
    list.push(skill);
    groups.set(skill.category, list);
  }

  const rank = (category: string) => {
    const index = SKILL_CATEGORIES.indexOf(
      category as (typeof SKILL_CATEGORIES)[number],
    );

    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  return Array.from(groups.entries()).sort(
    ([a], [b]) => rank(a) - rank(b) || a.localeCompare(b),
  );
}

function FormSection({
  step,
  icon: Icon,
  title,
  description,
  children,
}: {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-background shadow-xs">
      <header className="flex items-start gap-3 border-b px-5 py-4 sm:px-6">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="text-xs font-medium text-muted-foreground">
            Step {step} of 4
          </p>
          <h2 className="font-heading text-base font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </header>

      <div className="px-5 py-5 sm:px-6">{children}</div>
    </section>
  );
}

export default function TechnicianApplyForm() {
  const router = useRouter();
  const { mutate: apply, isPending } = useApplyAsTechnician();

  const {
    data: skillsData,
    isPending: skillsPending,
    isError: skillsError,
    refetch: refetchSkills,
  } = useGetSkills();

  const [skillSearch, setSkillSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const allSkills = skillsData?.data ?? [];

  const skillGroups = useMemo(() => groupByCategory(allSkills), [allSkills]);

  const skillById = useMemo(
    () => new Map(allSkills.map((skill) => [skill.id, skill])),
    [allSkills],
  );

  const visibleGroups = useMemo(() => {
    const term = skillSearch.trim().toLowerCase();

    return skillGroups
      .filter(([category]) => !activeCategory || category === activeCategory)
      .map(
        ([category, skills]) =>
          [
            category,
            term
              ? skills.filter((skill) =>
                  skill.name.toLowerCase().includes(term),
                )
              : skills,
          ] as [string, Skill[]],
      )
      .filter(([, skills]) => skills.length > 0);
  }, [skillGroups, skillSearch, activeCategory]);

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: technicianApplicationSchema,
    },
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
              ...(value.gender && {
                gender: value.gender as Gender,
              }),
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
              description: "We sent an OTP to your email. Please verify.",
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
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-12 lg:py-16">
        {/* Left: Introduction and application process */}
        <aside className="flex flex-col gap-8 lg:sticky lg:top-16 lg:self-start">
          <div className="flex flex-col gap-3">
            <Badge variant="secondary" className="w-fit">
              Technician application
            </Badge>

            <h1 className="font-heading text-3xl font-bold tracking-tight">
              Apply as a technician
            </h1>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Tell us about yourself, your skills and your experience. Our team
              will review your application once you verify your email.
            </p>
          </div>

          <ol className="hidden flex-col gap-5 lg:flex">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border bg-background text-primary">
                  <step.icon className="size-4" />
                </div>

                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">
                    {index + 1}. {step.title}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        {/* Right: Application form */}
        <form
          className="flex min-w-0 flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {/* 1. Account details */}
          <FormSection
            step={1}
            icon={UserIcon}
            title="Account details"
            description="You will use these details to sign in."
          >
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
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
                        <FieldLabel htmlFor={field.name}>
                          Email address
                        </FieldLabel>

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
              </div>

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

                        {isInvalid ? (
                          <FieldError errors={field.state.meta.errors} />
                        ) : (
                          <FieldDescription>
                            Min 8 characters with uppercase, lowercase, number
                            and a special character.
                          </FieldDescription>
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
          </FormSection>

          {/* 2. Professional profile */}
          <FormSection
            step={2}
            icon={BriefcaseIcon}
            title="Professional profile"
            description="Help customers and our team know who you are."
          >
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

                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(
                            e.target
                              .value as TechnicianApplicationFormValues["gender"],
                          )
                        }
                        className="border-input bg-background ring-offset-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      >
                        {GENDER_ITEMS.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
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
                        maxLength={500}
                        placeholder="Tell us about your work, specialities and experience"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                      />

                      <FieldDescription className="text-right">
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
          </FormSection>

          {/* 3. Skills and expertise */}
          <FormSection
            step={3}
            icon={WrenchIcon}
            title="Skills and expertise"
            description={`Select the services you can perform and your level in each (up to ${MAX_SKILLS}).`}
          >
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
                      {
                        skillId,
                        level: "INTERMEDIATE",
                      },
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

                const selectedInCategory = (category: string) =>
                  selected.filter(
                    (item) =>
                      skillById.get(item.skillId)?.category === category,
                  ).length;

                if (skillsPending) {
                  return (
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-9 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  );
                }

                if (skillsError) {
                  return (
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
                  );
                }

                if (skillGroups.length === 0) {
                  return (
                    <p className="text-sm text-muted-foreground">
                      No skills are available yet. Please try again later.
                    </p>
                  );
                }

                return (
                  <div className="flex flex-col gap-5">
                    {/* Selected skill summary */}
                    <div
                      className={cn(
                        "flex flex-col gap-2 rounded-lg border border-dashed p-3",
                        selected.length > 0 && "border-primary/40 bg-primary/5",
                      )}
                    >
                      <p className="text-xs font-medium text-muted-foreground">
                        Selected skills ({selected.length}/{MAX_SKILLS})
                      </p>

                      {selected.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          Nothing selected yet. Choose at least one skill below.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {selected.map((item) => (
                            <Badge
                              key={item.skillId}
                              variant="secondary"
                              className="h-6 gap-1 pr-1"
                            >
                              {skillById.get(item.skillId)?.name ?? "Skill"}

                              <button
                                type="button"
                                aria-label={`Remove ${
                                  skillById.get(item.skillId)?.name ?? "skill"
                                }`}
                                className="rounded-full p-0.5 hover:bg-foreground/10"
                                onClick={() => toggle(item.skillId, false)}
                              >
                                <XIcon className="size-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Search skills */}
                    <div className="relative">
                      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        placeholder="Search skills..."
                        className="pl-8"
                        aria-label="Search skills"
                      />
                    </div>

                    {/* Category filters */}
                    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
                      {[
                        { key: "", label: "All" },
                        ...skillGroups.map(([category]) => ({
                          key: category,
                          label: category,
                        })),
                      ].map((chip) => {
                        const active = activeCategory === chip.key;

                        const count = chip.key
                          ? selectedInCategory(chip.key)
                          : 0;

                        return (
                          <button
                            key={chip.key || "all"}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setActiveCategory(chip.key)}
                            className={cn(
                              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                              active
                                ? "border-primary bg-primary text-primary-foreground"
                                : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            {chip.label}

                            {count > 0 && (
                              <span
                                className={cn(
                                  "rounded-full px-1.5 text-[10px] leading-4",
                                  active
                                    ? "bg-primary-foreground/20"
                                    : "bg-primary/10 text-primary",
                                )}
                              >
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Filtered skill list */}
                    {visibleGroups.length === 0 ? (
                      <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
                        No skills match your search.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-6">
                        {visibleGroups.map(([category, skills]) => (
                          <div key={category} className="flex flex-col gap-2">
                            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                              {category}
                            </p>

                            <div className="flex flex-col gap-2">
                              {skills.map((skill) => {
                                const current = selected.find(
                                  (item) => item.skillId === skill.id,
                                );

                                const checkboxId = `skill-${skill.id}`;

                                return (
                                  <div
                                    key={skill.id}
                                    className={cn(
                                      "flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                                      current
                                        ? "border-primary/40 bg-primary/5"
                                        : "hover:bg-muted/50",
                                    )}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <Checkbox
                                        id={checkboxId}
                                        checked={Boolean(current)}
                                        onCheckedChange={(checked) =>
                                          toggle(skill.id, checked === true)
                                        }
                                      />

                                      <label
                                        htmlFor={checkboxId}
                                        className="cursor-pointer text-sm font-medium"
                                      >
                                        {skill.name}
                                      </label>
                                    </div>

                                    {current && (
                                      <div
                                        role="group"
                                        aria-label={`${skill.name} level`}
                                        className="inline-flex rounded-lg border bg-muted/60 p-0.5"
                                      >
                                        {LEVEL_ITEMS.map((item) => {
                                          const active =
                                            current.level === item.value;

                                          return (
                                            <button
                                              key={item.value}
                                              type="button"
                                              aria-pressed={active}
                                              onClick={() =>
                                                setLevel(skill.id, item.value)
                                              }
                                              className={cn(
                                                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                                                active
                                                  ? "bg-background text-foreground shadow-xs"
                                                  : "text-muted-foreground hover:text-foreground",
                                              )}
                                            >
                                              {item.label}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </div>
                );
              }}
            </form.Field>
          </FormSection>

          {/* 4. Documents */}
          <FormSection
            step={4}
            icon={FileTextIcon}
            title="Documents"
            description="Optional, but a resume and certificates help us approve you faster."
          >
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
          </FormSection>

          {/* Submit bar */}
          <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl border bg-background/95 p-3 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <form.Subscribe selector={(state) => state.values.skills.length}>
              {(count) => (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{count}</span>{" "}
                  {count === 1 ? "skill" : "skills"} selected
                </p>
              )}
            </form.Subscribe>

            <Button disabled={isPending} type="submit" size="lg">
              {isPending ? (
                <>
                  <Spinner />
                  Submitting application
                </>
              ) : (
                "Submit application"
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
