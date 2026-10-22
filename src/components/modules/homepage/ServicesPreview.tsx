"use client";

import { ArrowRightIcon, WrenchIcon } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSkills } from "@/hooks";
import type { Skill } from "@/types";

const PREVIEW_COUNT = 6;

function pickPreview(skills: Skill[]) {
  const byCategory = new Map<string, Skill[]>();
  for (const skill of skills) {
    byCategory.set(skill.category, [
      ...(byCategory.get(skill.category) ?? []),
      skill,
    ]);
  }
  const picked: Skill[] = [];
  let round = 0;
  while (picked.length < PREVIEW_COUNT) {
    let added = false;
    for (const list of byCategory.values()) {
      if (list[round] && picked.length < PREVIEW_COUNT) {
        picked.push(list[round]);
        added = true;
      }
    }
    if (!added) {
      break;
    }
    round += 1;
  }
  return picked;
}

export default function ServicesPreview() {
  const { data, isPending, isError } = useGetSkills();
  const preview = pickPreview(data?.data ?? []);

  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl space-y-2">
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Services we cover
            </h2>
            <p className="text-muted-foreground">
              Skilled technicians across many trades, ready when you need them.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            See all services
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {isPending ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {["a", "b", "c", "d", "e", "f"].map((id) => (
              <Skeleton key={id} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : isError || preview.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            Our service list is being updated. Check back soon.
          </p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((skill) => (
              <li
                key={skill.id}
                className="flex gap-4 rounded-xl border bg-card p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <WrenchIcon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {skill.category}
                  </p>
                  <h3 className="font-heading font-medium">{skill.name}</h3>
                  {skill.description ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {skill.description}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
