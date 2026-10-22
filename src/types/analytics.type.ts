import type {
  AssignmentStatus,
  PaymentStatus,
  ServiceRequestStatus,
  TechnicianVerificationStatus,
  WorkOrderStatus,
} from "./enum.type";

// Backend `analytics.service.ts` এর response এর সাথে মিল।
// টাকার amount এখানে number (round2 করা), Decimal string নয়।

// ?from=YYYY-MM-DD&to=YYYY-MM-DD (দুটোই ঐচ্ছিক; `to` পুরো দিন ধরে)
export type AnalyticsRangeParams = {
  from?: string;
  to?: string;
};

export type LeaderboardSortBy =
  | "completedJobs"
  | "averageRating"
  | "laborHours";

export type LeaderboardParams = AnalyticsRangeParams & {
  // 1-50, default 10
  limit?: number;
  sortBy?: LeaderboardSortBy;
};

export interface AnalyticsRange {
  from: string | null;
  to: string | null;
}

// ---------- GET /analytics/dashboard (ADMIN) ----------

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
  // admin এর "এখনই দেখা দরকার" তালিকা
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

// ---------- GET /analytics/technicians (ADMIN leaderboard) ----------

export interface TechnicianLeaderboardRow {
  technicianId: string;
  name: string;
  imageUrl: string;
  isAvailable: boolean;
  experienceYears: number;
  completedJobs: number;
  laborHours: number;
  // review না থাকলে null
  averageRating: number | null;
  totalReviews: number;
}

export interface TechnicianLeaderboard {
  range: AnalyticsRange;
  sortBy: LeaderboardSortBy;
  totalTechnicians: number;
  data: TechnicianLeaderboardRow[];
}

// ---------- GET /analytics/technicians/me (TECHNICIAN) ----------
// ---------- GET /analytics/technicians/:id (ADMIN) ----------

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
    // key "1".."5"
    distribution: Record<string, number>;
  };
  assignments: {
    total: number;
    byStatus: Record<AssignmentStatus, number>;
    // শতাংশ (0-100)
    cancellationRate: number;
    upcomingVisits: number;
  };
  workOrders: { byStatus: Record<WorkOrderStatus, number> };
}
