import type { Departure, Tour } from "@prisma/client";
import { tripEnd } from "@/data/dates";

type TourRow = Tour & { departures: Departure[] };

export type TourDto = {
  slug: string;
  title: string;
  subtitle: string;
  country: string;
  city: string;
  continent: string;
  destinationSlug: string;
  organizerId: string;
  durationDays: number;
  price: number;
  seats: number;
  seatsTaken: number;
  startDate: string;
  endDate: string;
  departures: { start: string; taken: number }[];
  difficulty: string;
  style: string;
  tags: string[];
  cover: string;
  gallery: string[];
  included: string[];
  excluded: string[];
  itinerary: { day: number; title: string; text: string }[];
  meetingPoint: string;
  cancellation: string;
  rating: number;
  reviewsCount: number;
  source: "seed" | "user";
};

export function toTour(tour: TourRow): TourDto {
  const departures = [...tour.departures]
    .sort((a, b) => a.start.localeCompare(b.start))
    .map((item) => ({ start: item.start, taken: item.taken }));
  const seatsTaken = departures.reduce((sum, item) => sum + item.taken, 0);
  const startDate = departures[0]?.start ?? "";
  const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary : [];
  return {
    slug: tour.slug,
    title: tour.title,
    subtitle: tour.subtitle,
    country: tour.country,
    city: tour.city,
    continent: tour.continent,
    destinationSlug: tour.destinationSlug,
    organizerId: tour.organizerId,
    durationDays: tour.durationDays,
    price: tour.price,
    seats: tour.seats,
    seatsTaken,
    startDate,
    endDate: startDate ? tripEnd(startDate, tour.durationDays) : "",
    departures,
    difficulty: tour.difficulty,
    style: tour.style,
    tags: tour.tags,
    cover: tour.cover,
    gallery: tour.gallery,
    included: tour.included,
    excluded: tour.excluded,
    itinerary: itinerary as TourDto["itinerary"],
    meetingPoint: tour.meetingPoint,
    cancellation: tour.cancellation,
    rating: tour.rating,
    reviewsCount: tour.reviewsCount,
    source: tour.source === "seed" ? "seed" : "user",
  };
}

export const tourInclude = { departures: true } as const;
