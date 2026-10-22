"use client";

import { MessageSquareIcon } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/ui/table-pagination";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/constants";
import {
  useGetAllFeedbacks,
  useGetMyFeedbacks,
  useGetMyTechnicianFeedbacks,
  useGetTechnicians,
} from "@/hooks";
import type { Feedback, RatingSummary, SortOrder } from "@/types";
import { getErrorMessage } from "@/utils";
import FeedbackCard, {
  DeleteFeedbackDialog,
  type FeedbackMode,
} from "./feedback-card";
import { FeedbackEditDialog } from "./feedback-form";
import RatingStars from "./rating-stars";

const RATING_OPTIONS = [5, 4, 3, 2, 1].map((value) => ({
  value: String(value),
  label: `${value} star${value > 1 ? "s" : ""}`,
}));

const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "rating:desc", label: "Highest rated" },
  { value: "rating:asc", label: "Lowest rated" },
];

const SKELETON_ROWS = ["a", "b", "c"];

export function RatingSummaryCard({ summary }: { summary: RatingSummary }) {
  const total = summary.totalFeedbacks;

  return (
    <Card>
      <CardContent className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex flex-col items-center gap-1 sm:px-6">
          <span className="font-heading text-4xl font-semibold tabular-nums">
            {total > 0 ? summary.averageRating.toFixed(1) : "—"}
          </span>
          <RatingStars value={summary.averageRating} />
          <span className="text-xs text-muted-foreground">
            {total} review{total === 1 ? "" : "s"}
          </span>
        </div>

        <ul className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution[String(star)] ?? 0;
            const percent = total > 0 ? (count / total) * 100 : 0;
            return (
              <li key={star} className="flex items-center gap-3 text-sm">
                <span className="w-10 shrink-0 text-muted-foreground tabular-nums">
                  {star} star
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span
                    className="block h-full rounded-full bg-amber-400"
                    style={{ width: `${percent}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right text-muted-foreground tabular-nums">
                  {count}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}

const COPY: Record<
  FeedbackMode,
  { title: string; description: string; empty: string }
> = {
  admin: {
    title: "Feedbacks",
    description: "Every customer review across all technicians and services.",
    empty: "Reviews appear here once customers rate completed jobs.",
  },
  customer: {
    title: "My feedbacks",
    description: "The reviews you have given. You can edit or delete them.",
    empty: "After a job is completed, rate it from the request page.",
  },
  technician: {
    title: "My feedbacks",
    description: "What customers say about your work.",
    empty: "Customer reviews for your completed jobs will show up here.",
  },
};

export default function FeedbackList({ mode }: { mode: FeedbackMode }) {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [rating, setRating] = useState("");
  const [technicianId, setTechnicianId] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const [editTarget, setEditTarget] = useState<Feedback | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Feedback | null>(null);

  const [sortBy, sortOrder] = sort.split(":") as [string, SortOrder];
  const params = {
    page,
    limit: DEFAULT_PAGE_SIZE,
    sortBy,
    sortOrder,
    rating: rating ? Number(rating) : ("" as const),
  };

  const adminQuery = useGetAllFeedbacks(
    { ...params, technicianId },
    { enabled: mode === "admin" },
  );
  const customerQuery = useGetMyFeedbacks(params, {
    enabled: mode === "customer",
  });
  const technicianQuery = useGetMyTechnicianFeedbacks(params, {
    enabled: mode === "technician",
  });

  // admin কে technician filter দেওয়ার জন্য (শুধু admin mode এ request যায়)
  const techniciansQuery = useGetTechnicians(
    { page: 1, limit: 100, verificationStatus: "APPROVED" },
    { enabled: mode === "admin" },
  );

  const isTechnician = mode === "technician";
  const activeQuery =
    mode === "admin"
      ? adminQuery
      : mode === "customer"
        ? customerQuery
        : technicianQuery;

  const { isPending, isError, error, refetch } = activeQuery;
  const feedbacks: Feedback[] = isTechnician
    ? (technicianQuery.data?.data.feedbacks ?? [])
    : ((mode === "admin" ? adminQuery.data : customerQuery.data)?.data ?? []);
  const meta = activeQuery.data?.meta;
  const totalPages = meta?.totalPages ?? 1;
  const summary = technicianQuery.data?.data.summary;
  const hasFilter = Boolean(rating || technicianId);

  const technicianOptions = (techniciansQuery.data?.data ?? []).map(
    (technician) => ({ value: technician.id, label: technician.name }),
  );

  const resetFilters = () => {
    setRating("");
    setTechnicianId("");
    setPage(DEFAULT_PAGE);
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={COPY[mode].title}
        description={COPY[mode].description}
      />

      {isTechnician && summary ? <RatingSummaryCard summary={summary} /> : null}

      <FilterBar
        filters={[
          {
            key: "rating",
            label: "Rating",
            value: rating,
            onChange: (value) => {
              setRating(value);
              setPage(DEFAULT_PAGE);
            },
            options: RATING_OPTIONS,
            allLabel: "All ratings",
          },
          ...(mode === "admin"
            ? [
                {
                  key: "technician",
                  label: "Technician",
                  value: technicianId,
                  onChange: (value: string) => {
                    setTechnicianId(value);
                    setPage(DEFAULT_PAGE);
                  },
                  options: technicianOptions,
                  allLabel: "All technicians",
                },
              ]
            : []),
        ]}
        onReset={resetFilters}
      >
        <SortSelect
          value={sort}
          onChange={(value) => {
            setSort(value);
            setPage(DEFAULT_PAGE);
          }}
        />
      </FilterBar>

      {isError ? (
        <EmptyState
          title="Could not load feedbacks"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : isPending ? (
        <div className="flex flex-col gap-3">
          {SKELETON_ROWS.map((id) => (
            <Skeleton key={id} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : feedbacks.length === 0 ? (
        <EmptyState
          icon={MessageSquareIcon}
          title={
            hasFilter ? "No feedbacks match your filter" : "No feedbacks yet"
          }
          description={
            hasFilter
              ? "Try a different rating or technician."
              : COPY[mode].empty
          }
        />
      ) : (
        <>
          <div className="flex flex-col gap-3">
            {feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback.id}
                feedback={feedback}
                mode={mode}
                onEdit={mode === "customer" ? setEditTarget : undefined}
                onDelete={mode === "technician" ? undefined : setDeleteTarget}
              />
            ))}
          </div>
          <TablePagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}

      {mode === "customer" ? (
        <FeedbackEditDialog
          feedback={editTarget}
          onOpenChange={(open) => {
            if (!open) {
              setEditTarget(null);
            }
          }}
        />
      ) : null}

      {mode === "technician" ? null : (
        <DeleteFeedbackDialog
          feedback={deleteTarget}
          mode={mode}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteTarget(null);
            }
          }}
        />
      )}
    </div>
  );
}

function SortSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      aria-label="Sort feedbacks"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-8 min-w-36 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
