import type { SortOrder } from "./enum.type";

export interface Feedback {
  id: string;
  rating: number;
  comment: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  serviceRequestId: string;
  customer: {
    id: string;
    name: string;
    user: { imageUrl: string };
  };
  serviceRequest: {
    id: string;
    title: string;
    city: string;
    // শুধু CONFIRMED assignment (সর্বোচ্চ ১টা)
    assignments: { technician: { id: string; name: string } }[];
  };
}

export type FeedbackListParams = {
  page?: number;
  limit?: number;

  sortBy?: string;
  sortOrder?: SortOrder;

  rating?: number | "";

  technicianId?: string;
};

export interface CreateFeedbackPayload {
  serviceRequestId: string;
  rating: number;
  comment?: string;
}

export interface UpdateFeedbackPayload {
  rating?: number;
  comment?: string;
}

export interface RatingSummary {
  averageRating: number;
  totalFeedbacks: number;
  distribution: Record<string, number>;
}

export interface TechnicianFeedbackResult {
  technician: { id: string; name: string };
  summary: RatingSummary;
  feedbacks: Feedback[];
}

export interface DeletedFeedbackResult {
  id: string;
}
