import type { ReactNode } from "react";

// detail page এর "label + value" জোড়া (<dl> এর ভেতরে বসে)
export default function InfoRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}
