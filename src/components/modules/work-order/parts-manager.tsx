"use client";

import { useForm } from "@tanstack/react-form";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import ConfirmDialog from "@/components/common/confirm-dialog";
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
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { useAddPart, useRemovePart } from "@/hooks";
import type { WorkOrderPart } from "@/types";
import { formatCurrency, getErrorMessage } from "@/utils";
import { addPartSchema } from "@/validation";

interface PartsManagerProps {
  workOrderId: string;
  parts: WorkOrderPart[];
  editable: boolean;
}

function sumParts(parts: WorkOrderPart[]) {
  return parts.reduce((sum, part) => sum + Number(part.totalCost), 0);
}

export default function PartsManager({
  workOrderId,
  parts,
  editable,
}: PartsManagerProps) {
  const [removing, setRemoving] = useState<WorkOrderPart | null>(null);
  const { mutate: remove, isPending: removingPending } = useRemovePart();

  const handleRemove = () => {
    if (!removing) {
      return;
    }
    remove(
      { id: workOrderId, partId: removing.id },
      {
        onSuccess: () => {
          toast.add({ title: "Part removed", type: "success" });
          setRemoving(null);
        },
        onError: (err) => {
          toast.add({
            title: "Could not remove part",
            description: getErrorMessage(err),
            type: "error",
          });
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parts &amp; materials</CardTitle>
        <CardDescription>
          {editable
            ? "Add every part used. You can change parts only while the work is in progress."
            : parts.length === 0
              ? "No parts were used."
              : `${parts.length} item(s)`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {parts.length > 0 ? (
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Part</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="hidden text-right sm:table-cell">
                    Unit cost
                  </TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  {editable ? <TableHead className="w-12" /> : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {parts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>
                      <span className="block font-medium">{part.name}</span>
                      {part.notes ? (
                        <span className="block text-xs text-muted-foreground">
                          {part.notes}
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">
                      {part.quantity}
                    </TableCell>
                    <TableCell className="hidden text-right sm:table-cell">
                      {formatCurrency(part.unitCost)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(part.totalCost)}
                    </TableCell>
                    {editable ? (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Remove ${part.name}`}
                          onClick={() => setRemoving(part)}
                        >
                          <Trash2Icon />
                        </Button>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Parts total
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(sumParts(parts))}
                  </TableCell>
                  {editable ? <TableCell /> : null}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ) : null}

        {editable ? <AddPartForm workOrderId={workOrderId} /> : null}
      </CardContent>

      <ConfirmDialog
        open={Boolean(removing)}
        onOpenChange={(open) => {
          if (!open) {
            setRemoving(null);
          }
        }}
        title="Remove this part?"
        description={
          removing
            ? `“${removing.name}” will be deleted from the work order.`
            : undefined
        }
        confirmText="Remove"
        variant="destructive"
        isLoading={removingPending}
        onConfirm={handleRemove}
      />
    </Card>
  );
}

function AddPartForm({ workOrderId }: { workOrderId: string }) {
  const { mutate: add, isPending } = useAddPart();

  const form = useForm({
    defaultValues: { name: "", quantity: "1", unitCost: "", notes: "" },
    validators: { onSubmit: addPartSchema },
    onSubmit: ({ value }) => {
      const notes = value.notes.trim();

      add(
        {
          id: workOrderId,
          payload: {
            name: value.name.trim(),
            quantity: Number(value.quantity),
            unitCost: Number(value.unitCost),
            ...(notes && { notes }),
          },
        },
        {
          onSuccess: () => {
            toast.add({ title: "Part added", type: "success" });
            form.reset();
          },
          onError: (err) => {
            toast.add({
              title: "Could not add part",
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
      className="rounded-xl border border-dashed p-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-6">
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-3">
                  <FieldLabel htmlFor={field.name}>Part name</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. Compressor"
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

          <form.Field name="quantity">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-1">
                  <FieldLabel htmlFor={field.name}>Qty</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    inputMode="numeric"
                    min={1}
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

          <form.Field name="unitCost">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="sm:col-span-2">
                  <FieldLabel htmlFor={field.name}>Unit cost (৳)</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
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
        </div>

        <form.Field name="notes">
          {(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid;
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Notes (optional)</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
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
            {isPending ? <Spinner /> : <PlusIcon />}
            Add part
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
