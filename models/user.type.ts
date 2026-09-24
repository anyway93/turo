export type UserRole = "traveler" | "organizer" | "admin";

export interface User {
  id: string;
  email: string;
  password: string;
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
