import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: ReactNode;
  icon?: LucideIcon;
  description?: string;
  isLoading?: boolean;
  className?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  isLoading,
  className,
}: StatCardProps) {
  return (
    <Card size="sm" className={cn("min-w-0", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="truncate text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-1">
        {isLoading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="font-heading text-2xl font-semibold tabular-nums">
            {value}
          </div>
        )}
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardContent>
    </Card>
  );
}
