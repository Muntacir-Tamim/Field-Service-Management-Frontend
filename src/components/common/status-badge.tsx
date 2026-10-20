import { Badge } from "@/components/ui/badge";
import type { StatusTone } from "@/constants";
import { STATUS_MAPS, type StatusKind, type StatusMeta } from "@/constants";
import { humanizeEnum } from "@/utils";

const TONE_VARIANT = {
  neutral: "muted",
  info: "info",
  warning: "warning",
  success: "success",
  danger: "destructive",
} as const satisfies Record<StatusTone, string>;

type StatusValue<K extends StatusKind> = Extract<
  keyof (typeof STATUS_MAPS)[K],
  string
>;

interface StatusBadgeProps<K extends StatusKind> {
  kind: K;
  value: StatusValue<K> | null | undefined;
  className?: string;
}

// ব্যবহার: <StatusBadge kind="workOrder" value={order.status} />
// kind আর value মিলে না গেলে TypeScript ধরবে। backend এ নতুন value এলে
// crash না করে সাধারণ ধূসর badge দেখাবে।
export default function StatusBadge<K extends StatusKind>({
  kind,
  value,
  className,
}: StatusBadgeProps<K>) {
  if (!value) {
    return (
      <Badge variant="muted" className={className}>
        —
      </Badge>
    );
  }

  const map = STATUS_MAPS[kind] as Record<string, StatusMeta>;
  const meta: StatusMeta = map[value] ?? {
    label: humanizeEnum(value),
    tone: "neutral",
  };

  return (
    <Badge variant={TONE_VARIANT[meta.tone]} className={className}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </Badge>
  );
}
