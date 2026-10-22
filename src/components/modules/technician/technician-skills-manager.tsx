"use client";

import { useForm } from "@tanstack/react-form";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/confirm-dialog";
import EmptyState from "@/components/common/empty-state";
import PageHeader from "@/components/common/page-header";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { SKILL_LEVEL_OPTIONS } from "@/constants";
import {
  useAddMySkill,
  useGetMyTechnicianProfile,
  useGetSkills,
  useRemoveMySkill,
} from "@/hooks";
import type { SkillLevel, TechnicianSkillEntry } from "@/types";
import { getErrorMessage } from "@/utils";
import { addMySkillSchema } from "@/validation";

export default function TechnicianSkillsManager() {
  const [removing, setRemoving] = useState<TechnicianSkillEntry | null>(null);

  const { data, isPending, isError, error, refetch } =
    useGetMyTechnicianProfile();
  const { data: skillsData } = useGetSkills();
  const { mutate: addSkill, isPending: adding } = useAddMySkill();
  const { mutate: removeSkill, isPending: removingPending } =
    useRemoveMySkill();

  const mySkills = data?.data.skills ?? [];
  const ownedIds = new Set(mySkills.map((entry) => entry.skill.id));
  const options = (skillsData?.data ?? [])
    .filter((skill) => !ownedIds.has(skill.id))
    .map((skill) => ({
      value: skill.id,
      label: `${skill.name} (${skill.category})`,
    }));

  const form = useForm({
    defaultValues: { skillId: "", level: "INTERMEDIATE" as SkillLevel },
    validators: { onSubmit: addMySkillSchema },
    onSubmit: ({ value }) => {
      addSkill(value, {
        onSuccess: () => {
          toast.add({ title: "Skill added", type: "success" });
          form.reset();
        },
        onError: (err) => {
          toast.add({
            title: "Could not add skill",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      });
    },
  });

  const changeLevel = (entry: TechnicianSkillEntry, level: SkillLevel) => {
    if (level === entry.level) {
      return;
    }

    addSkill(
      { skillId: entry.skill.id, level },
      {
        onSuccess: () => toast.add({ title: "Level updated", type: "success" }),
        onError: (err) =>
          toast.add({
            title: "Could not update level",
            description: getErrorMessage(err),
            type: "error",
          }),
      },
    );
  };

  const handleRemove = () => {
    if (!removing) {
      return;
    }
    removeSkill(removing.skill.id, {
      onSuccess: () => {
        toast.add({ title: "Skill removed", type: "success" });
        setRemoving(null);
      },
      onError: (err) => {
        toast.add({
          title: "Could not remove skill",
          description: getErrorMessage(err),
          type: "error",
        });
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My skills"
        description="Admins use your skills and levels when assigning visits. You must keep at least one skill."
      />

      {isError ? (
        <EmptyState
          title="Could not load your skills"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your skills</CardTitle>
              <CardDescription>
                {isPending ? "Loading…" : `${mySkills.length} skill(s)`}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {isPending ? (
                <>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </>
              ) : (
                mySkills.map((entry) => (
                  <div
                    key={entry.skill.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border px-3 py-2"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {entry.skill.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {entry.skill.category}
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <Select
                        items={SKILL_LEVEL_OPTIONS}
                        value={entry.level}
                        disabled={adding}
                        onValueChange={(value) =>
                          changeLevel(entry, value as SkillLevel)
                        }
                      >
                        <SelectTrigger
                          aria-label={`${entry.skill.name} level`}
                          className="w-36"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                          {SKILL_LEVEL_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Remove ${entry.skill.name}`}
                        disabled={mySkills.length <= 1}
                        title={
                          mySkills.length <= 1
                            ? "You must keep at least one skill"
                            : undefined
                        }
                        onClick={() => setRemoving(entry)}
                      >
                        <Trash2Icon />
                      </Button>
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add a skill</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
              >
                <FieldGroup>
                  <form.Field name="skillId">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Skill</FieldLabel>
                          <Select
                            items={options}
                            value={field.state.value}
                            onValueChange={(value) => {
                              field.handleChange(value ?? "");
                              field.handleBlur();
                            }}
                          >
                            <SelectTrigger id={field.name} className="w-full">
                              <SelectValue placeholder="Choose a skill" />
                            </SelectTrigger>
                            <SelectContent alignItemWithTrigger={false}>
                              {options.length === 0 ? (
                                <p className="px-2 py-1.5 text-sm text-muted-foreground">
                                  No more skills to add
                                </p>
                              ) : (
                                options.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="level">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Level</FieldLabel>
                        <Select
                          items={SKILL_LEVEL_OPTIONS}
                          value={field.state.value}
                          onValueChange={(value) =>
                            field.handleChange(
                              (value as SkillLevel) ?? "INTERMEDIATE",
                            )
                          }
                        >
                          <SelectTrigger id={field.name} className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent alignItemWithTrigger={false}>
                            {SKILL_LEVEL_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  </form.Field>

                  <Button type="submit" disabled={adding}>
                    {adding ? <Spinner /> : <PlusIcon />}
                    Add skill
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(open) => {
          if (!open) {
            setRemoving(null);
          }
        }}
        title="Remove this skill?"
        description={
          removing
            ? `“${removing.skill.name}” will be removed from your profile.`
            : undefined
        }
        confirmText="Remove"
        variant="destructive"
        isLoading={removingPending}
        onConfirm={handleRemove}
      />
    </div>
  );
}
