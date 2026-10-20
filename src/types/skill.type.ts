// Backend `Skill` model (GET /skills এর প্রতিটা item)
export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
}

// GET /skills এর query param (pagination নেই; পুরো list একসাথে আসে)
export type SkillListParams = {
  category?: string;
  searchTerm?: string;
};

// POST /skills
export interface CreateSkillPayload {
  name: string;
  category: string;
  description?: string;
}

// PATCH /skills/:skillId (অন্তত একটা field লাগে)
export type UpdateSkillPayload = Partial<CreateSkillPayload>;
