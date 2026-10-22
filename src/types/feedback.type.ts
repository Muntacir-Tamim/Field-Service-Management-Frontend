import type { SortOrder } from "./enum.type";

// Backend `CustomerFeedback` model + `feedbackInclude` (feedback.service.ts)।
// সব list endpoint এ একই shape আসে।
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
  // createdAt | rating
  sortBy?: string;
  sortOrder?: SortOrder;
  // 1-5; খালি মানে সব
  rating?: number | "";
  // শুধু ADMIN এর GET /feedbacks এ কাজ করে
  technicianId?: string;
};

// POST /feedbacks (CUSTOMER; service request COMPLETED হতে হবে, একটার জন্য একবারই)
export interface CreateFeedbackPayload {
  serviceRequestId: string;
  rating: number;
  comment?: string;
}

// PATCH /feedbacks/:id (CUSTOMER, শুধু নিজের; অন্তত একটা field)
export interface UpdateFeedbackPayload {
  rating?: number;
  comment?: string;
}

// backend `getTechnicianRatingSummary()`; distribution এর key "1".."5"
export interface RatingSummary {
  averageRating: number;
  totalFeedbacks: number;
  distribution: Record<string, number>;
}

// GET /feedbacks/technician/:technicianId (ADMIN) আর /feedbacks/technician/my-feedbacks (TECHNICIAN)।
// `meta` আছে ApiResponse এর ওপরে (pagination)।
export interface TechnicianFeedbackResult {
  technician: { id: string; name: string };
  summary: RatingSummary;
  feedbacks: Feedback[];
}

// DELETE /feedbacks/:id
export interface DeletedFeedbackResult {
  id: string;
}
