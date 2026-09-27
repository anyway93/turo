import type { Continent, Difficulty, ItineraryDay, TourStyle } from "@/models";

export interface ToursQuery {
  q?: string;
  continent?: string;
  style?: string;
  difficulty?: string;
  destination?: string;
  mine?: boolean;
}

export interface CreateTourInput {
  title: string;
  subtitle?: string;
  city: string;
  country: string;
  continent: Continent;
  difficulty: Difficulty;
  style: TourStyle;
  price: number;
  seats: number;
  durationDays: number;
  cover: string;
  slug?: string;
  destinationSlug?: string;
  gallery?: string[];
  tags?: string[];
  included?: string[];
  excluded?: string[];
  itinerary?: ItineraryDay[];
  meetingPoint?: string;
  cancellation?: string;
  startDate?: string;
  departures?: { start: string }[];
}

export interface UpdateTourInput {
  title?: string;
  subtitle?: string;
  city?: string;
  country?: string;
  meetingPoint?: string;
  price?: number;
  seats?: number;
  cover?: string;
  gallery?: string[];
  cancellation?: string;
}

export interface CreateReviewInput {
  rating: number;
  title: string;
  text: string;
}
