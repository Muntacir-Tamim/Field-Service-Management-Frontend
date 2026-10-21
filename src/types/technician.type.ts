import type {
  Gender,
  SkillLevel,
  SortOrder,
  TechnicianVerificationStatus,
  UserStatus,
} from "./enum.type";
import type { Skill } from "./skill.type";

// ---------- PUBLIC: POST /technicians/apply ----------

// multipart এর `data` field এ string হয়ে যায়
export interface ApplyAsTechnicianPayload {
  name: string;
  email: string;
  password: string;
  technician: {
    contactNumber: string;
    gender?: Gender;
    address?: string;
    bio?: string;
    experienceYears: number;
  };
  skills: { skillId: string; level?: SkillLevel }[];
}

// ফাইল গুলো আলাদা: backend field name `resume` (১টা) আর `documents` (সর্বোচ্চ ৫টা)
export interface ApplyAsTechnicianInput {
  data: ApplyAsTechnicianPayload;
  resume?: File | null;
  documents?: File[];
}

// ---------- Technician (admin list / detail / my-profile) ----------

export type SkillRef = Pick<Skill, "id" | "name" | "category">;

export interface TechnicianSkillEntry {
  level: SkillLevel;
  certifiedAt: string | null;
  skill: SkillRef;
}

// আবেদনের সময় upload করা ফাইল (Json column)
export interface StoredFile {
  url: string;
  publicId: string;
  resourceType: string;
}

// GET /technicians, /technicians/:id, /technicians/my-profile
export interface Technician {
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
  documents: StoredFile[] | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  skills: TechnicianSkillEntry[];
  user: {
    id: string;
    emailVerified: boolean;
    status: UserStatus;
    imageUrl: string;
  };
}

export type TechnicianListParams = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
  searchTerm?: string;
  verificationStatus?: TechnicianVerificationStatus | "";
  isAvailable?: "true" | "false" | "";
  skillId?: string;
};

// ADMIN: PATCH /technicians/:id/review (REJECTED হলে reason বাধ্যতামূলক, min 5)
export interface ReviewTechnicianPayload {
  verificationStatus: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

// ---------- TECHNICIAN: নিজের available / skill ----------

// PATCH /technicians/my-availability
export interface AvailabilityResult {
  id: string;
  isAvailable: boolean;
}

// POST /technicians/my-skills
export interface AddMySkillPayload {
  skillId: string;
  level?: SkillLevel;
}
