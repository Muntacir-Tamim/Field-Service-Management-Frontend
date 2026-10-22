export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
}

export type SkillListParams = {
  category?: string;
  searchTerm?: string;
};

export interface CreateSkillPayload {
  name: string;
  category: string;
  description?: string;
}

export type UpdateSkillPayload = Partial<CreateSkillPayload>;
