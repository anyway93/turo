import type { UserRole } from "@/models";

export interface ApiUser {
  id: string;
  email?: string;
  name: string;
  role: UserRole;
  avatar: string;
  city: string;
  country: string;
  bio: string;
  languages: string[];
  rating: number;
  reviewsCount: number;
  yearsGuiding?: number;
}

export interface IResponseOk {
  ok: true;
}
