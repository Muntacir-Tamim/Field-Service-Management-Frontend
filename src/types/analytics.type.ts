import type {
  AssignmentStatus,
  PaymentStatus,
  ServiceRequestStatus,
  TechnicianVerificationStatus,
  WorkOrderStatus,
} from "./enum.type";

export type AnalyticsRangeParams = {
  from?: string;
  to?: string;
};

export type LeaderboardSortBy =
  | "completedJobs"
  | "averageRating"
  | "laborHours";

export type LeaderboardParams = AnalyticsRangeParams & {
  limit?: number;
  sortBy?: LeaderboardSortBy;
};

export interface AnalyticsRange {
  from: string | null;
  to: string | null;
}

interface StatusBreakdown<S extends string> {
  total: number;
  byStatus: Record<S, number>;
}

export interface DashboardStats {
  range: AnalyticsRange;
  serviceRequests: StatusBreakdown<ServiceRequestStatus>;
  assignments: StatusBreakdown<AssignmentStatus>;
  workOrders: StatusBreakdown<WorkOrderStatus>;
  payments: StatusBreakdown<PaymentStatus> & {
    amounts: { collected: number; outstanding: number; refunded: number };
  };
  technicians: {
    total: number;
    byVerification: Record<TechnicianVerificationStatus, number>;
    availableNow: number;
  };
  customers: { total: number };
  feedback: { totalReviews: number; averageRating: number | null };

  needsAttention: {
    pendingServiceRequests: number;
    underReviewServiceRequests: number;
    approvedWaitingForAssignment: number;
    workOrdersAwaitingVerification: number;
    unpaidInvoices: number;
    pendingTechnicianApplications: number;
    visitsToday: number;
  };
}

export interface TechnicianLeaderboardRow {
  technicianId: string;
  name: string;
  imageUrl: string;
  isAvailable: boolean;
  experienceYears: number;
  completedJobs: number;
  laborHours: number;

  averageRating: number | null;
  totalReviews: number;
}

export interface TechnicianLeaderboard {
  range: AnalyticsRange;
  sortBy: LeaderboardSortBy;
  totalTechnicians: number;
  data: TechnicianLeaderboardRow[];
}

export interface TechnicianStats {
  technician: {
    id: string;
    name: string;
    isAvailable: boolean;
    experienceYears: number;
    verificationStatus: TechnicianVerificationStatus;
  };
  range: AnalyticsRange;
  jobs: { completed: number };
  laborHours: { total: number; averagePerJob: number };
  rating: {
    average: number | null;
    totalReviews: number;

    distribution: Record<string, number>;
  };
  assignments: {
    total: number;
    byStatus: Record<AssignmentStatus, number>;

    cancellationRate: number;
    upcomingVisits: number;
  };
  workOrders: { byStatus: Record<WorkOrderStatus, number> };
}
