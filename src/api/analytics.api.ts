import apiClient from "@/lib/apiClient";
import type {
  AnalyticsRangeParams,
  ApiResponse,
  DashboardStats,
  LeaderboardParams,
  TechnicianLeaderboard,
  TechnicianStats,
} from "@/types";
import { cleanParams } from "@/utils";

export function getDashboardStats(params?: AnalyticsRangeParams) {
  return apiClient<ApiResponse<DashboardStats>>("/analytics/dashboard", {
    query: cleanParams(params),
  });
}

export function getTechnicianLeaderboard(params?: LeaderboardParams) {
  return apiClient<ApiResponse<TechnicianLeaderboard>>(
    "/analytics/technicians",
    {
      query: cleanParams(params),
    },
  );
}

export function getMyStats(params?: AnalyticsRangeParams) {
  return apiClient<ApiResponse<TechnicianStats>>("/analytics/technicians/me", {
    query: cleanParams(params),
  });
}

export function getTechnicianStats(
  technicianId: string,
  params?: AnalyticsRangeParams,
) {
  return apiClient<ApiResponse<TechnicianStats>>(
    `/analytics/technicians/${technicianId}`,
    { query: cleanParams(params) },
  );
}
