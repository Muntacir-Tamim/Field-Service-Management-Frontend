import type { Gender, SkillLevel } from "./enum.type";

// POST /technicians/apply এর JSON অংশ (multipart এর `data` field এ string হয়ে যায়)
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

// NOTE: Step 5 (Technician module) এ বাকি type এই file এই যোগ হবে
