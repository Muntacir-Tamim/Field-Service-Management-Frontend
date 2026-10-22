import Link from "next/link";
import StatusBadge from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { getAuditActionTone, getAuditEntityHref } from "@/constants";
import type { AuditLog } from "@/types";
import { formatDateTime, humanizeEnum } from "@/utils";

const TONE_VARIANT = {
  neutral: "muted",
  info: "info",
  warning: "warning",
  success: "success",
  danger: "destructive",
} as const;

export function AuditActionBadge({ action }: { action: AuditLog["action"] }) {
  return (
    <Badge variant={TONE_VARIANT[getAuditActionTone(action)]}>
      {humanizeEnum(action)}
    </Badge>
  );
}

function isEmptyValue(value: unknown) {
  if (value === null || value === undefined) {
    return true;
  }
  return typeof value === "object" && Object.keys(value).length === 0;
}

function JsonBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{title}</p>
      {isEmptyValue(value) ? (
        <p className="text-sm text-muted-foreground">—</p>
      ) : (
        <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
          {JSON.stringify(value, null, 2)}
        </pre>
      )}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-sm break-words">{children}</dd>
    </div>
  );
}

export default function AuditLogContent({ log }: { log: AuditLog }) {
  const entityHref = getAuditEntityHref(log.entityType, log.entityId);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <AuditActionBadge action={log.action} />
        <p className="text-sm">{log.description}</p>
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <Row label="When">{formatDateTime(log.createdAt)}</Row>
        <Row label="Performed by">
          {log.actor ? (
            <span className="block">
              {log.actor.name}
              <span className="block text-xs text-muted-foreground">
                {log.actor.email}
              </span>
            </span>
          ) : (
            "System"
          )}
        </Row>
        <Row label="Actor role">
          {log.actorRole ? (
            <StatusBadge kind="role" value={log.actorRole} />
          ) : (
            "—"
          )}
        </Row>
        <Row label="Entity">
          {humanizeEnum(log.entityType.replace(/([a-z])([A-Z])/g, "$1_$2"))}
        </Row>
        <Row label="Entity ID">
          <span className="font-mono text-xs">{log.entityId}</span>
          {entityHref ? (
            <Link
              href={entityHref}
              className="mt-1 block text-xs text-primary hover:underline"
            >
              Open in admin
            </Link>
          ) : null}
        </Row>
        <Row label="Log ID">
          <span className="font-mono text-xs">{log.id}</span>
        </Row>
      </dl>

      <div className="grid gap-4 sm:grid-cols-2">
        <JsonBlock title="Before" value={log.oldValue} />
        <JsonBlock title="After" value={log.newValue} />
      </div>
      <JsonBlock title="Extra details" value={log.metadata} />
    </div>
  );
}
