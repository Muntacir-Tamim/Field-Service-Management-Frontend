import type { AuditAction, SortOrder, UserRole } from "./enum.type";

export interface AuditLog {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  description: string;
  oldValue: unknown;
  newValue: unknown;
  metadata: unknown;
  actorId: string | null;
  actorRole: UserRole | null;
  createdAt: string;
  actor: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  } | null;
}

export type AuditLogListParams = {
  page?: number;
  limit?: number;
  // createdAt | action | entityType
  sortBy?: string;
  sortOrder?: SortOrder;
  action?: AuditAction | "";
  actorRole?: UserRole | "";
  entityType?: string;
  entityId?: string;
  actorId?: string;
  // ISO date (yyyy-MM-dd); `to` এ শুধু date দিলে ওই দিনের শুরু ধরা হয়
  from?: string;
  to?: string;
  // description বা হুবহু entityId তে খোঁজে
  searchTerm?: string;
};
