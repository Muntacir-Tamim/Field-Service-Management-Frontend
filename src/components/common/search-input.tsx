"use client";

import { SearchIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/debounce.hook";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  delay = 500,
  className,
}: SearchInputProps) {
  const [text, setText] = useState(value);
  const debounced = useDebounce(text, delay);
  const lastSynced = useRef(value);
  useEffect(() => {
    if (debounced === text && debounced !== lastSynced.current) {
      lastSynced.current = debounced;
      onChange(debounced);
    }
  }, [debounced, text, onChange]);

  useEffect(() => {
    if (value !== lastSynced.current) {
      lastSynced.current = value;
      setText(value);
    }
  }, [value]);

  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="px-8 [&::-webkit-search-cancel-button]:hidden"
      />
      {text ? (
        <button
          type="button"
          onClick={() => {
            setText("");
            lastSynced.current = "";
            onChange("");
          }}
          className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
          aria-label="Clear search"
        >
          <XIcon className="size-4" />
        </button>
      ) : null}
    </div>
  );
}
