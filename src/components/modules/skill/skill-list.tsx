"use client";

import { PlusIcon, SparklesIcon } from "lucide-react";
import { useMemo, useState } from "react";
import ConfirmDialog from "@/components/common/confirm-dialog";
import EmptyState from "@/components/common/empty-state";
import FilterBar from "@/components/common/filter-bar";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { useDeleteSkill, useGetSkills } from "@/hooks";
import type { Skill } from "@/types";
import { getErrorMessage } from "@/utils";
import SkillFormDialog from "./skill-form-dialog";
import SkillTable from "./skill-table";

// /admin/skills এর পুরো UI: filter + table + create/edit/delete dialog
export default function SkillList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");

  // form dialog: create (skill = null) / edit (skill = Skill)
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [deleting, setDeleting] = useState<Skill | null>(null);

  const { data, isPending, isError, error, refetch } = useGetSkills({
    searchTerm,
    category,
  });
  // filter ছাড়া পুরো list শুধু category dropdown/suggestion এর জন্য (cache এ ভাগ হয়)
  const { data: allData } = useGetSkills();
  const { mutate: remove, isPending: isDeleting } = useDeleteSkill();

  const skills = data?.data ?? [];

  const categories = useMemo(
    () => [...new Set((allData?.data ?? []).map((s) => s.category))].sort(),
    [allData],
  );

  const hasFilter = Boolean(searchTerm || category);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditing(skill);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (!deleting) {
      return;
    }
    remove(deleting.id, {
      onSuccess: () => {
        toast.add({
          title: "Skill deleted",
          description: `"${deleting.name}" has been removed`,
          type: "success",
        });
        setDeleting(null);
      },
      onError: (err) => {
        // যেমন: technician ব্যবহার করলে backend 409 দেয়
        toast.add({
          title: "Could not delete skill",
          description: getErrorMessage(err),
          type: "error",
        });
        setDeleting(null);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Skills"
        description="Manage the skills technicians can list on their profile."
        actions={
          <Button onClick={openCreate}>
            <PlusIcon />
            Add skill
          </Button>
        }
      />

      <FilterBar
        search={{
          value: searchTerm,
          onChange: setSearchTerm,
          placeholder: "Search skills...",
        }}
        filters={[
          {
            key: "category",
            label: "Category",
            allLabel: "All categories",
            value: category,
            onChange: setCategory,
            options: categories.map((c) => ({ label: c, value: c })),
          },
        ]}
        onReset={() => {
          setSearchTerm("");
          setCategory("");
        }}
      />

      {isError ? (
        <EmptyState
          title="Could not load skills"
          description={getErrorMessage(error)}
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !isPending && skills.length === 0 ? (
        <EmptyState
          icon={SparklesIcon}
          title={hasFilter ? "No skills match your filters" : "No skills yet"}
          description={
            hasFilter
              ? "Try a different search or clear the filters."
              : "Add the first skill so technicians can select it."
          }
          action={
            hasFilter ? undefined : (
              <Button onClick={openCreate}>
                <PlusIcon />
                Add skill
              </Button>
            )
          }
        />
      ) : (
        <SkillTable
          skills={skills}
          isLoading={isPending}
          onEdit={openEdit}
          onDelete={setDeleting}
        />
      )}

      <SkillFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        skill={editing}
        categories={categories}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleting(null);
          }
        }}
        title="Delete skill?"
        description={
          <>
            <strong>{deleting?.name}</strong> will be removed. This is not
            possible while technicians are using it.
          </>
        }
        confirmText="Delete"
        variant="destructive"
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
