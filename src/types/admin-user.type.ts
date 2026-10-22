import type {
  AuthProvider,
  SortOrder,
  TechnicianVerificationStatus,
  UserRole,
  UserStatus,
} from "./enum.type";

// GET /admin/users এর প্রতিটা item (backend `userListSelect`; password/googleId আসে না)
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  authProvider: AuthProvider;
  imageUrl: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    contactNumber: string | null;
    city: string | null;
  } | null;
  technician: {
    id: string;
    contactNumber: string | null;
    verificationStatus: TechnicianVerificationStatus;
    isAvailable: boolean;
  } | null;
}

export type AdminUserListParams = {
  page?: number;
  limit?: number;
  // name, email, contact number এ খোঁজে
  searchTerm?: string;
  role?: UserRole | "";
  // DELETED দিলে শুধু soft-deleted user আসে; না দিলে deleted বাদ
  status?: UserStatus | "";
  // createdAt | name | email
  sortBy?: string;
  sortOrder?: SortOrder;
};

// PATCH /admin/users/:userId/status
// BLOCKED করতে reason বাধ্যতামূলক (5-300 অক্ষর)
export interface UpdateUserStatusPayload {
  status: "ACTIVE" | "BLOCKED";
  reason?: string;
}

// DELETE /admin/users/:userId
export interface DeleteUserResult {
  id: string;
  deletedAt: string;
}
