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

// ADMIN: পুরো system এর সংখ্যা (backend এ ৬০ সেকেন্ড cache)
export function getDashboardStats(params?: AnalyticsRangeParams) {
  return apiClient<ApiResponse<DashboardStats>>("/analytics/dashboard", {
    query: cleanParams(params),
  });
}

// ADMIN: technician দের ranking
export function getTechnicianLeaderboard(params?: LeaderboardParams) {
  return apiClient<ApiResponse<TechnicianLeaderboard>>(
    "/analytics/technicians",
    {
      query: cleanParams(params),
    },
  );
}

// TECHNICIAN: নিজের stats
export function getMyStats(params?: AnalyticsRangeParams) {
  return apiClient<ApiResponse<TechnicianStats>>("/analytics/technicians/me", {
    query: cleanParams(params),
  });
}

// ADMIN: একজন technician এর stats
export function getTechnicianStats(
  technicianId: string,
  params?: AnalyticsRangeParams,
) {
  return apiClient<ApiResponse<TechnicianStats>>(
    `/analytics/technicians/${technicianId}`,
    { query: cleanParams(params) },
  );
}
