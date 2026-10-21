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

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  department: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
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

// PATCH /users/me : role অনুযায়ী আলাদা body (backend strict, অচেনা field দিলে reject)
// অন্তত একটা field লাগে
export interface UpdateCustomerProfilePayload {
  name?: string;
  contactNumber?: string;
  gender?: Gender;
  address?: string;
  city?: string;
}

export interface UpdateTechnicianMyProfilePayload {
  name?: string;
  contactNumber?: string;
  gender?: Gender;
  address?: string;
  bio?: string;
  experienceYears?: number;
}

export interface UpdateAdminProfilePayload {
  name?: string;
  contactNumber?: string;
  department?: string;
}

export type UpdateMyProfilePayload =
  | UpdateCustomerProfilePayload
  | UpdateTechnicianMyProfilePayload
  | UpdateAdminProfilePayload;

// GET /users/me এর data: role profile আলাদা key (customer/technician/admin) তে নয়,
// `profile` key তে আসে। (UI তে সাধারণত useGetMe এর User ই ব্যবহার হয়)
export type MyProfile = Omit<User, "customer" | "technician" | "admin"> & {
  profile: CustomerProfile | TechnicianProfile | AdminProfile | null;
};

// PATCH /users/me/profile-image এর data (user এর base record)
export type ProfileImageResult = Omit<
  User,
  "customer" | "technician" | "admin"
>;
