import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  // ডান পাশের button (যেমন "New request")
  actions?: ReactNode;
  // detail page এ list এ ফেরার link
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  actions,
  backHref,
  backLabel = "Back",
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {backHref ? (
        <Link
          href={backHref}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 w-fit text-muted-foreground",
          )}
        >
          <ChevronLeftIcon />
          {backLabel}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h1 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  );
}
