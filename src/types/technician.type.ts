import type {
  Gender,
  SkillLevel,
  SortOrder,
  TechnicianVerificationStatus,
  UserStatus,
} from "./enum.type";
import type { Skill } from "./skill.type";

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

export interface ApplyAsTechnicianInput {
  data: ApplyAsTechnicianPayload;
  resume?: File | null;
  documents?: File[];
}

export type SkillRef = Pick<Skill, "id" | "name" | "category">;

export interface TechnicianSkillEntry {
  level: SkillLevel;
  certifiedAt: string | null;
  skill: SkillRef;
}

export interface StoredFile {
  url: string;
  publicId: string;
  resourceType: string;
}

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

export interface ReviewTechnicianPayload {
  verificationStatus: "APPROVED" | "REJECTED";
  rejectionReason?: string;
}

export interface AvailabilityResult {
  id: string;
  isAvailable: boolean;
}

export interface AddMySkillPayload {
  skillId: string;
  level?: SkillLevel;
}
