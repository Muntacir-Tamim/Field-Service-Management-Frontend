"use client";

import { FilterXIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ALL_VALUE } from "@/utils";
import SearchInput from "./search-input";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  // screen reader label (যেমন "Status")
  label: string;
  // খালি string মানে "All"
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  // প্রথম item এর লেখা, default: "All <label>"
  allLabel?: string;
}

interface FilterBarProps {
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  filters?: FilterConfig[];
  // দিলে সক্রিয় filter থাকলে "Clear" button দেখাবে
  onReset?: () => void;
  // ডান পাশে অতিরিক্ত control (যেমন date picker)
  children?: ReactNode;
  className?: string;
}

export default function FilterBar({
  search,
  filters = [],
  onReset,
  children,
  className,
}: FilterBarProps) {
  const hasActive =
    Boolean(search?.value) || filters.some((filter) => Boolean(filter.value));

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {search ? (
        <SearchInput
          value={search.value}
          onChange={search.onChange}
          placeholder={search.placeholder}
        />
      ) : null}

      {filters.map((filter) => {
        const allLabel = filter.allLabel ?? `All ${filter.label.toLowerCase()}`;
        const items = [
          { value: ALL_VALUE, label: allLabel },
          ...filter.options,
        ];

        return (
          <Select
            key={filter.key}
            items={items}
            value={filter.value || ALL_VALUE}
            onValueChange={(next) =>
              filter.onChange(!next || next === ALL_VALUE ? "" : next)
            }
          >
            <SelectTrigger aria-label={filter.label} className="min-w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false}>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}

      {children}

      {onReset && hasActive ? (
        <Button variant="ghost" size="sm" onClick={onReset}>
          <FilterXIcon />
          Clear
        </Button>
      ) : null}
    </div>
  );
}
