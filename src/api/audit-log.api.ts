import apiClient from "@/lib/apiClient";
import type { ApiResponse, AuditLog, AuditLogListParams } from "@/types";
import { cleanParams } from "@/utils";

// ADMIN: route এর prefix `/admin/audit-logs`
export function getAuditLogs(params?: AuditLogListParams) {
  return apiClient<ApiResponse<AuditLog[]>>("/admin/audit-logs", {
    query: cleanParams(params),
  });
}

export function getAuditLogById(auditLogId: string) {
  return apiClient<ApiResponse<AuditLog>>(`/admin/audit-logs/${auditLogId}`);
}
