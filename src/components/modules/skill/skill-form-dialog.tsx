"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { useCreateSkill, useUpdateSkill } from "@/hooks";
import type { Skill } from "@/types";
import { getErrorMessage } from "@/utils";
import { skillSchema } from "@/validation";

interface SkillFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skill?: Skill | null;
  categories?: string[];
}

export default function SkillFormDialog({
  open,
  onOpenChange,
  skill,
  categories = [],
}: SkillFormDialogProps) {
  const isEdit = Boolean(skill);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit skill" : "Add skill"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the skill details."
              : "Create a skill that technicians can add to their profile."}
          </DialogDescription>
        </DialogHeader>

        <SkillForm
          skill={skill}
          categories={categories}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function SkillForm({
  skill,
  categories,
  onClose,
}: {
  skill?: Skill | null;
  categories: string[];
  onClose: () => void;
}) {
  const { mutate: create, isPending: isCreating } = useCreateSkill();
  const { mutate: update, isPending: isUpdating } = useUpdateSkill();
  const isPending = isCreating || isUpdating;

  const form = useForm({
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "",
      description: skill?.description ?? "",
    },
    validators: { onSubmit: skillSchema },
    onSubmit: ({ value }) => {
      const name = value.name.trim();
      const category = value.category.trim();
      const description = value.description.trim();

      const callbacks = {
        onSuccess: () => {
          toast.add({
            title: skill ? "Skill updated" : "Skill created",
            description: `"${name}" saved successfully`,
            type: "success",
          });
          onClose();
        },
        onError: (err: unknown) => {
          toast.add({
            title: skill ? "Could not update skill" : "Could not create skill",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      };

      if (skill) {
        update(
          { id: skill.id, payload: { name, category, description } },
          callbacks,
        );
      } else {
        create(
          { name, category, description: description || undefined },
          callbacks,
        );
      }
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
        <form.Field name="name">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="e.g. AC repair"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  autoFocus
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <form.Field name="category">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="e.g. Electrical"
                  list="skill-categories"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                <datalist id="skill-categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
                {isInvalid ? (
                  <FieldError errors={field.state.meta.errors} />
                ) : (
                  <FieldDescription>
                    Pick an existing category or type a new one.
                  </FieldDescription>
                )}
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
                <FieldLabel htmlFor={field.name}>
                  Description (optional)
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={3}
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
      </FieldGroup>

      <DialogFooter className="mt-4">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? <Spinner /> : null}
          {skill ? "Save changes" : "Create skill"}
        </Button>
      </DialogFooter>
    </form>
  );
}
