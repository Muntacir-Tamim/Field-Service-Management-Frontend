"use client";

import { UsersIcon } from "lucide-react";
import { useState } from "react";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import TablePagination from "@/components/ui/table-pagination";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  TECHNICIAN_VERIFICATION_OPTIONS,
} from "@/constants";
import { useGetSkills, useGetTechnicians } from "@/hooks";
import type { Technician, TechnicianVerificationStatus } from "@/types";
import { getErrorMessage } from "@/utils";
import TechnicianReviewSheet from "./technician-review-sheet";
import TechnicianTable from "./technician-table";

const AVAILABILITY_OPTIONS = [
  { value: "true", label: "Available" },
  { value: "false", label: "Unavailable" },
];

// /admin/technicians
export default function TechnicianList() {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TechnicianVerificationStatus | "">("");
  const [availability, setAvailability] = useState<"true" | "false" | "">("");
  const [skillId, setSkillId] = useState("");
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const { data: skillsData } = useGetSkills();

  const { data, isPending, isError, error, refetch } = useGetTechnicians({
    page,
    limit: DEFAULT_PAGE_SIZE,
    searchTerm: search,
    verificationStatus: status,
    isAvailable: availability,
    skillId,
  });

  const technicians = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const hasFilter = Boolean(search || status || availability || skillId);

  const skillOptions = (skillsData?.data ?? []).map((skill) => ({
    value: skill.id,
    label: skill.name,
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Technicians"
        description="Review applications and manage your technician team."
      />

      <FilterBar
        search={{
          value: search,
          onChange: (value) => {
            setSearch(value);
            setPage(DEFAULT_PAGE);
          },
          placeholder: "Search name, email or phone",
        }}
        filters={[
          {
            key: "status",
            label: "Status",
            value: status,
            onChange: (value) => {
              setStatus(value as TechnicianVerificationStatus | "");
              setPage(DEFAULT_PAGE);
            },
            options: TECHNICIAN_VERIFICATION_OPTIONS,
            allLabel: "All statuses",
          },
          {
            key: "availability",
            label: "Availability",
            value: availability,
            onChange: (value) => {
              setAvailability(value as "true" | "false" | "");
              setPage(DEFAULT_PAGE);
            },
            options: AVAILABILITY_OPTIONS,
            allLabel: "Any availability",
          },
          {
            key: "skill",
            label: "Skill",
            value: skillId,
            onChange: (value) => {
              setSkillId(value);
              setPage(DEFAULT_PAGE);
            },
            options: skillOptions,
            allLabel: "All skills",
          },
        ]}
        onReset={() => {
          setSearch("");
          setStatus("");
          setAvailability("");
          setSkillId("");
          setPage(DEFAULT_PAGE);
        }}
      />

      {isError ? (
        <EmptyState
          title="Could not load technicians"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !isPending && technicians.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={
            hasFilter
              ? "No technicians match your filters"
              : "No technicians yet"
          }
          description={
            hasFilter
              ? "Try changing or clearing the filters."
              : "Technician applications will appear here."
          }
        />
      ) : (
        <>
          <TechnicianTable
            technicians={technicians}
            isLoading={isPending}
            onReview={(technician: Technician) => setReviewingId(technician.id)}
          />
          <TablePagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </>
      )}

      <TechnicianReviewSheet
        technicianId={reviewingId}
        onOpenChange={(open) => {
          if (!open) {
            setReviewingId(null);
          }
        }}
      />
    </div>
  );
}
