import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getMyStats,
  getTechnicianLeaderboard,
  getTechnicianStats,
} from "@/api";
import { analyticsKeys } from "@/constants";
import type { AnalyticsRangeParams, LeaderboardParams } from "@/types";

export function useGetDashboardStats(params?: AnalyticsRangeParams) {
  return useQuery({
    queryKey: [...analyticsKeys.admin, params ?? {}],
    queryFn: () => getDashboardStats(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetTechnicianLeaderboard(params?: LeaderboardParams) {
  return useQuery({
    queryKey: analyticsKeys.technicianPerformance(params),
    queryFn: () => getTechnicianLeaderboard(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetMyStats(params?: AnalyticsRangeParams) {
  return useQuery({
    queryKey: [...analyticsKeys.technician, "me", params ?? {}],
    queryFn: () => getMyStats(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetTechnicianStats(
  technicianId: string | null,
  params?: AnalyticsRangeParams,
) {
  return useQuery({
    queryKey: [...analyticsKeys.technician, technicianId, params ?? {}],
    queryFn: () => getTechnicianStats(technicianId as string, params),
    enabled: Boolean(technicianId),
    placeholderData: keepPreviousData,
  });
}
