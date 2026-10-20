"use client";

import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { type DragEvent, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/utils";

interface FileDropzoneProps {
  // parent ফাইলের list ধরে রাখে (controlled)
  value: File[];
  onChange: (files: File[]) => void;
  // input accept এর মতো: "image/*,.pdf"
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
  label?: string;
  hint?: string;
  className?: string;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) {
    return true;
  }
  const rules = accept
    .split(",")
    .map((rule) => rule.trim().toLowerCase())
    .filter(Boolean);
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return rules.some((rule) => {
    if (rule.startsWith(".")) {
      return name.endsWith(rule);
    }
    if (rule.endsWith("/*")) {
      return type.startsWith(rule.slice(0, -1));
    }
    return type === rule;
  });
}

export default function FileDropzone({
  value,
  onChange,
  accept,
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 5,
  disabled = false,
  label = "Drag files here or click to browse",
  hint,
  className,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const limit = multiple ? maxFiles : 1;

  function addFiles(incoming: File[]) {
    const nextErrors: string[] = [];
    const accepted: File[] = [];

    for (const file of incoming) {
      if (!matchesAccept(file, accept)) {
        nextErrors.push(`${file.name}: this file type is not allowed`);
      } else if (file.size > maxSizeMB * 1024 * 1024) {
        nextErrors.push(`${file.name}: larger than ${maxSizeMB} MB`);
      } else {
        accepted.push(file);
      }
    }

    // single mode এ নতুন ফাইল পুরনোটা replace করে
    let merged = multiple ? [...value, ...accepted] : accepted.slice(0, 1);
    if (merged.length > limit) {
      nextErrors.push(`You can upload up to ${limit} files`);
      merged = merged.slice(0, limit);
    }

    setErrors(nextErrors);
    if (accepted.length > 0) {
      onChange(merged);
    }
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setIsDragging(false);
    if (disabled) {
      return;
    }
    addFiles(Array.from(event.dataTransfer.files));
  }

  function removeFile(index: number) {
    setErrors([]);
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("space-y-3", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) {
            setIsDragging(true);
          }
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
          isDragging ? "border-primary bg-primary/5" : "hover:bg-muted/50",
        )}
      >
        <UploadCloudIcon
          className="size-6 text-muted-foreground"
          aria-hidden="true"
        />
        <span className="text-sm font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {hint ?? `Up to ${maxSizeMB} MB per file`}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => {
          addFiles(Array.from(event.target.files ?? []));
          // একই ফাইল আবার বাছাই করা যাবে
          event.target.value = "";
        }}
      />

      {errors.length > 0 ? (
        <ul className="space-y-1 text-sm text-destructive" role="alert">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}

      {value.length > 0 ? (
        <ul className="space-y-2">
          {value.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
            >
              <FileIcon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                disabled={disabled}
                className="shrink-0 rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                aria-label={`Remove ${file.name}`}
              >
                <XIcon className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
