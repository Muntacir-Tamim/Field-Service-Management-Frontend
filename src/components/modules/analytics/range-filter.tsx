"use client";

import { format, subDays } from "date-fns";
import FilterBar from "@/components/common/filter-bar";
import type { AnalyticsRangeParams } from "@/types";

export type RangePreset = "" | "7" | "30" | "90" | "365";

const RANGE_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "365", label: "Last 12 months" },
];

// "30" → { from: "2026-09-22" }; খালি (All time) → {}
// `to` পাঠাই না: backend এ না দিলে আজ পর্যন্ত ধরা হয়
export function rangeFromPreset(preset: RangePreset): AnalyticsRangeParams {
  if (!preset) {
    return {};
  }
  return { from: format(subDays(new Date(), Number(preset)), "yyyy-MM-dd") };
}

// analytics page এর "All time / Last 30 days ..." dropdown
export default function RangeFilter({
  value,
  onChange,
}: {
  value: RangePreset;
  onChange: (value: RangePreset) => void;
}) {
  return (
    <FilterBar
      filters={[
        {
          key: "range",
          label: "Period",
          value,
          onChange: (next) => onChange(next as RangePreset),
          options: RANGE_OPTIONS,
          allLabel: "All time",
        },
      ]}
    />
  );
}
