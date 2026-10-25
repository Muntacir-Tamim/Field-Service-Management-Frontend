"use client";

import {
  ArrowRightIcon,
  DropletsIcon,
  HammerIcon,
  type LucideIcon,
  PaintRollerIcon,
  SnowflakeIcon,
  SparklesIcon,
  WifiIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSkills } from "@/hooks";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types";
import { display } from "./display-font";

const PREVIEW_COUNT = 6;

// category/name এর কথা দেখে icon বাছা হয়। না মিললে wrench
const ICON_RULES: [RegExp, LucideIcon][] = [
  [/electr|wiring|power|generator/i, ZapIcon],
  [/plumb|water|pipe|sanitary/i, DropletsIcon],
  [/\b(ac|a\/c)\b|air|hvac|cooling|refriger|fridge/i, SnowflakeIcon],
  [/clean|pest|sanitiz/i, SparklesIcon],
  [/paint|polish/i, PaintRollerIcon],
  [/carpent|furniture|wood|civil|masonry|tile/i, HammerIcon],
  [/network|internet|wifi|cctv|camera|security|computer|it\b/i, WifiIcon],
];

function pickIcon(skill: Skill): LucideIcon {
  const text = `${skill.category} ${skill.name}`;
  return ICON_RULES.find(([pattern]) => pattern.test(text))?.[1] ?? WrenchIcon;
}

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

// cell গুলোর মাঝের border এক পাশে টেনে একটা grid বানানো হয়েছে
const GRID =
  "grid overflow-hidden rounded-2xl border bg-background sm:grid-cols-2 lg:grid-cols-3 [&>li]:-mr-px [&>li]:-mb-px [&>li]:border-r [&>li]:border-b";

export default function ServicesPreview() {
  const { data, isPending, isError } = useGetSkills();
  const preview = pickPreview(data?.data ?? []);

  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl space-y-2">
            <h2
              className={cn(
                display.className,
                "text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl",
              )}
            >
              Services we cover
            </h2>
            <p className="text-muted-foreground">
              Skilled technicians across many trades, ready when you need them.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            See all services
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>

        {isPending ? (
          <ul className={cn(GRID, "mt-10")}>
            {["a", "b", "c", "d", "e", "f"].map((id) => (
              <li key={id} className="p-6">
                <Skeleton className="mb-4 size-11 rounded-xl" />
                <Skeleton className="mb-2 h-4 w-24" />
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ul>
        ) : isError || preview.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed bg-background p-8 text-center text-sm text-muted-foreground">
            Our service list is being updated. Check back soon.
          </p>
        ) : (
          <ul className={cn(GRID, "mt-10")}>
            {preview.map((skill) => {
              const Icon = pickIcon(skill);
              return (
                <li
                  key={skill.id}
                  className="group flex gap-4 p-6 transition-colors hover:bg-primary/5"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {skill.category}
                    </p>
                    <h3 className="font-semibold">{skill.name}</h3>
                    {skill.description ? (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {skill.description}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
