import type {
  AuthProvider,
  Gender,
  TechnicianVerificationStatus,
  UserRole,
  UserStatus,
} from "./enum.type";

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  gender: Gender | null;
  address: string | null;
  city: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface TechnicianProfile {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  gender: Gender | null;
  address: string | null;
  bio: string | null;
  experienceYears: number;
  verificationStatus: TechnicianVerificationStatus;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  isAvailable: boolean;
  resumeUrl: string | null;
  resumePublicId: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

// Admin model এর field backend এ এখনো দেখা হয়নি, তাই শুধু common field রাখা হলো
export interface AdminProfile {
  id: string;
  userId: string;
  [key: string]: unknown;
}

// GET /auth/me এর data (password omit করা থাকে)
export interface User {
  id: string;
  name: string;
  email: string;
  googleId: string | null;
  authProvider: AuthProvider;
  emailVerified: boolean;
  role: UserRole;
  status: UserStatus;
  needPasswordChange: boolean;
  imageUrl: string;
  imagePublicId: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer: CustomerProfile | null;
  technician: TechnicianProfile | null;
  admin: AdminProfile | null;
}
