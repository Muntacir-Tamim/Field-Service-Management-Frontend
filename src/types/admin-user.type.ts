import type {
  AuthProvider,
  SortOrder,
  TechnicianVerificationStatus,
  UserRole,
  UserStatus,
} from "./enum.type";

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

  searchTerm?: string;
  role?: UserRole | "";

  status?: UserStatus | "";
  // createdAt | name | email
  sortBy?: string;
  sortOrder?: SortOrder;
};

export interface UpdateUserStatusPayload {
  status: "ACTIVE" | "BLOCKED";
  reason?: string;
}

export interface DeleteUserResult {
  id: string;
  deletedAt: string;
}
