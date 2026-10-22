import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAuditLogById, getAuditLogs } from "@/api";
import { auditLogKeys } from "@/constants";
import type { AuditLogListParams } from "@/types";

export function useGetAuditLogs(params?: AuditLogListParams) {
  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: () => getAuditLogs(params),
    placeholderData: keepPreviousData,
  });
}

// id null হলে request যায় না (sheet বন্ধ থাকলে)
export function useGetAuditLog(id: string | null) {
  return useQuery({
    queryKey: auditLogKeys.detail(id ?? ""),
    queryFn: () => getAuditLogById(id as string),
    enabled: Boolean(id),
    retry: false,
  });
}
