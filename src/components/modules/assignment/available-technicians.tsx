"use client";

import { CheckCircle2Icon, UserCheckIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAvailableTechnicians } from "@/hooks";
import { cn } from "@/lib/utils";
import { getErrorMessage, getInitials } from "@/utils";

interface AvailableTechniciansProps {
  // ISO string; দুটো না থাকলে hint দেখায়
  scheduledStart?: string;
  scheduledEnd?: string;
  selectedId: string;
  onSelect: (technicianId: string) => void;
  // reschedule এ "বর্তমান technician রাখো" option এর জন্য
  keepOption?: { id: string; label: string };
  invalid?: boolean;
}

// নির্বাচিত সময়ে free technician এর তালিকা (card এ চাপলে select)
export default function AvailableTechnicians({
  scheduledStart,
  scheduledEnd,
  selectedId,
  onSelect,
  keepOption,
  invalid = false,
}: AvailableTechniciansProps) {
  const { data, isPending, isError, error, isFetching } =
    useGetAvailableTechnicians({ scheduledStart, scheduledEnd });

  const ready = Boolean(scheduledStart && scheduledEnd);
  const technicians = data?.data ?? [];

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg",
        invalid && "ring-2 ring-destructive/30",
      )}
      aria-busy={isFetching}
    >
      {keepOption ? (
        <button
          type="button"
          onClick={() => onSelect(keepOption.id)}
          aria-pressed={selectedId === keepOption.id}
          className={cn(
            "flex items-center justify-between gap-3 rounded-lg border p-3 text-left text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            selectedId === keepOption.id
              ? "border-primary bg-primary/5"
              : "hover:bg-muted/50",
          )}
        >
          <span className="inline-flex items-center gap-2 font-medium">
            <UserCheckIcon className="size-4" aria-hidden="true" />
            {keepOption.label}
          </span>
          {selectedId === keepOption.id ? (
            <CheckCircle2Icon className="size-4 text-primary" />
          ) : null}
        </button>
      ) : null}

      {!ready ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          Pick a valid start and end time to see free technicians.
        </p>
      ) : isPending ? (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : isError ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-destructive">
          {getErrorMessage(error)}
        </p>
      ) : technicians.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
          No technician is free in this time slot. Try a different time.
        </p>
      ) : (
        technicians.map((technician) => {
          const selected = selectedId === technician.id;
          return (
            <button
              key={technician.id}
              type="button"
              onClick={() => onSelect(technician.id)}
              aria-pressed={selected}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                selected ? "border-primary bg-primary/5" : "hover:bg-muted/50",
              )}
            >
              <Avatar>
                {technician.user.imageUrl ? (
                  <AvatarImage
                    src={technician.user.imageUrl}
                    alt={technician.name}
                  />
                ) : null}
                <AvatarFallback>{getInitials(technician.name)}</AvatarFallback>
              </Avatar>
              <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-medium">
                    {technician.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {technician.experienceYears} yr exp.
                  </span>
                </span>
                <span className="flex flex-wrap gap-1">
                  {technician.skills.map((entry) => (
                    <Badge key={entry.skill.id} variant="outline">
                      {entry.skill.name}
                    </Badge>
                  ))}
                </span>
              </span>
              {selected ? (
                <CheckCircle2Icon className="mt-1 size-4 shrink-0 text-primary" />
              ) : null}
            </button>
          );
        })
      )}
    </div>
  );
}
