"use client";

import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  STATUS_MAPS,
  type StatusKind,
  type StatusMeta,
  type StatusTone,
} from "@/constants";
import { humanizeEnum } from "@/utils";

// StatusBadge এর tone এর সাথে মিল রেখে chart এর রঙ (light/dark দুটোতেই পড়া যায়)
const TONE_COLOR: Record<StatusTone, string> = {
  neutral: "#94a3b8",
  info: "#3b82f6",
  warning: "#f59e0b",
  success: "#22c55e",
  danger: "#ef4444",
};

const AMBER = "#fbbf24";

const TOOLTIP_STYLE = {
  backgroundColor: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
};

export interface ChartDatum {
  name: string;
  value: number;
  color?: string;
}

// { PENDING: 3, APPROVED: 5 } → [{ name: "Pending", value: 3, color }]
// kind দিলে label আর রঙ status constant থেকে আসে; শূন্য মান বাদ যায়
export function statusChartData(
  kind: StatusKind,
  counts: Record<string, number>,
): ChartDatum[] {
  const map = STATUS_MAPS[kind] as Record<string, StatusMeta>;
  return Object.entries(counts)
    .filter(([, value]) => value > 0)
    .map(([status, value]) => {
      const meta = map[status];
      return {
        name: meta?.label ?? humanizeEnum(status),
        value,
        color: TONE_COLOR[meta?.tone ?? "neutral"],
      };
    });
}

interface ChartCardProps {
  title: string;
  description?: string;
  isLoading?: boolean;
  // true হলে chart এর জায়গায় "No data" দেখায়
  isEmpty?: boolean;
  emptyText?: string;
  className?: string;
  children: ReactNode;
}

// সব chart এর একই খোলস: title + loading + empty state
export function ChartCard({
  title,
  description,
  isLoading,
  isEmpty,
  emptyText = "No data for this period yet.",
  className,
  children,
}: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-56 w-full rounded-lg" />
        ) : isEmpty ? (
          <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
            {emptyText}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

// ---------- Donut ----------

export function DonutChart({
  data,
  centerLabel,
}: {
  data: ChartDatum[];
  // মাঝখানের লেখা (যেমন total)
  centerLabel?: string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-52 w-52 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={data.length > 1 ? 2 : 0}
              stroke="none"
            >
              {data.map((item) => (
                <Cell key={item.name} fill={item.color ?? TONE_COLOR.info} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-2xl font-semibold tabular-nums">
            {total}
          </span>
          {centerLabel ? (
            <span className="text-xs text-muted-foreground">{centerLabel}</span>
          ) : null}
        </div>
      </div>

      <ul className="grid w-full gap-1.5 text-sm">
        {data.map((item) => (
          <li key={item.name} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">
              {item.name}
            </span>
            <span className="font-medium tabular-nums">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Bar ----------

interface SimpleBarChartProps {
  data: ChartDatum[];
  // horizontal: নামগুলো বাঁ পাশে, bar ডানে বাড়ে (লম্বা নামের জন্য ভালো)
  layout?: "vertical" | "horizontal";
  height?: number;
  // প্রতিটা datum এ color না থাকলে এটা
  color?: string;
  // tooltip এ মানের পাশে কী লেখা (যেমন "jobs")
  unit?: string;
}

export function SimpleBarChart({
  data,
  layout = "vertical",
  height = 224,
  color = TONE_COLOR.info,
  unit,
}: SimpleBarChartProps) {
  const isHorizontal = layout === "horizontal";

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={isHorizontal ? "vertical" : "horizontal"}
          margin={{
            top: 4,
            right: 12,
            bottom: 0,
            left: isHorizontal ? 8 : -16,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--border)"
            horizontal={!isHorizontal}
            vertical={isHorizontal}
          />
          {isHorizontal ? (
            <>
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={96}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
            </>
          )}
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
            formatter={(value) => [`${value}${unit ? ` ${unit}` : ""}`, ""]}
            separator=""
          />
          <Bar dataKey="value" radius={4} maxBarSize={36}>
            {data.map((item) => (
              <Cell key={item.name} fill={item.color ?? color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------- ready-made charts ----------

// status → donut (যেমন service request status অনুযায়ী ভাগ)
export function StatusDonutChart({
  kind,
  counts,
  title,
  description,
  centerLabel = "total",
  isLoading,
  className,
}: {
  kind: StatusKind;
  counts?: Record<string, number>;
  title: string;
  description?: string;
  centerLabel?: string;
  isLoading?: boolean;
  className?: string;
}) {
  const data = counts ? statusChartData(kind, counts) : [];
  return (
    <ChartCard
      title={title}
      description={description}
      isLoading={isLoading}
      isEmpty={data.length === 0}
      className={className}
    >
      <DonutChart data={data} centerLabel={centerLabel} />
    </ChartCard>
  );
}

// status → bar (যেমন work order status)
export function StatusBarChart({
  kind,
  counts,
  title,
  description,
  isLoading,
  className,
}: {
  kind: StatusKind;
  counts?: Record<string, number>;
  title: string;
  description?: string;
  isLoading?: boolean;
  className?: string;
}) {
  const data = counts ? statusChartData(kind, counts) : [];
  return (
    <ChartCard
      title={title}
      description={description}
      isLoading={isLoading}
      isEmpty={data.length === 0}
      className={className}
    >
      <SimpleBarChart data={data} layout="horizontal" />
    </ChartCard>
  );
}

// 1-5 তারার review সংখ্যা (backend distribution এর key "1".."5")
export function RatingDistributionChart({
  distribution,
  title = "Rating distribution",
  description,
  isLoading,
  className,
}: {
  distribution?: Record<string, number>;
  title?: string;
  description?: string;
  isLoading?: boolean;
  className?: string;
}) {
  const data: ChartDatum[] = ["1", "2", "3", "4", "5"].map((star) => ({
    name: `${star}★`,
    value: distribution?.[star] ?? 0,
    color: AMBER,
  }));
  const isEmpty = data.every((item) => item.value === 0);

  return (
    <ChartCard
      title={title}
      description={description}
      isLoading={isLoading}
      isEmpty={isEmpty}
      emptyText="No reviews yet."
      className={className}
    >
      <SimpleBarChart data={data} unit="reviews" />
    </ChartCard>
  );
}
