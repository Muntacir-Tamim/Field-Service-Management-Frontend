"use client";

import { WrenchIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSkills } from "@/hooks";
import type { Skill } from "@/types";

function groupByCategory(skills: Skill[]) {
  const groups = new Map<string, Skill[]>();
  for (const skill of skills) {
    groups.set(skill.category, [...(groups.get(skill.category) ?? []), skill]);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

// /services এর পুরো তালিকা: category ধরে ভাগ করা, backend এর skill থেকে
export default function ServicesCatalog() {
  const { data, isPending, isError } = useGetSkills();
  const groups = groupByCategory(data?.data ?? []);

  if (isPending) {
    return (
      <div className="space-y-10">
        {["a", "b"].map((id) => (
          <div key={id} className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {["x", "y", "z"].map((cell) => (
                <Skeleton key={cell} className="h-24 rounded-xl" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || groups.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Our service list is being updated. Please check back soon.
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {groups.map(([category, skills]) => (
        <section key={category} className="space-y-4">
          <h2 className="font-heading text-lg font-semibold">{category}</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <li
                key={skill.id}
                className="flex gap-4 rounded-xl border bg-card p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <WrenchIcon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 space-y-1">
                  <h3 className="font-heading font-medium">{skill.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {skill.description ?? "Professional on-site service."}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
