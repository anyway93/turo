export type Continent = "Европа" | "Азия" | "Африка" | "Америка" | "Океания";

export type Difficulty = "лёгкий" | "средний" | "сложный";

export type TourStyle =
  | "пеший"
  | "город"
  | "гастро"
  | "природа"
  | "море"
  | "культура"
  | "фото"
  | "приключение";

export interface ItineraryDay {
  day: number;
  title: string;
  text: string;
}

export interface Departure {
  start: string;
  taken: number;
}

export interface Tour {
  slug: string;
  title: string;
  subtitle: string;
  country: string;
  city: string;
  continent: Continent;
  destinationSlug: string;
  organizerId: string;
  durationDays: number;
  price: number;
  seats: number;
  seatsTaken: number;
  startDate: string;
  endDate: string;
  departures: Departure[];
  difficulty: Difficulty;
  style: TourStyle;
  tags: string[];
  cover: string;
  gallery: string[];
  included: string[];
  excluded: string[];
  itinerary: ItineraryDay[];
  meetingPoint: string;
  cancellation: string;
  rating: number;
  reviewsCount: number;
  source?: "seed" | "user";
}
