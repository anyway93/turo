import type { UserRole } from "@/models";

export interface UpdateUserInput {
  name?: string;
  city?: string;
  bio?: string;
  role?: UserRole;
}
