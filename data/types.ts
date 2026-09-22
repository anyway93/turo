export type UserRole = "traveler" | "organizer" | "admin";

export type User = {
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
};

export type Destination = {
  slug: string;
  name: string;
  country: string;
  continent: string;
  image: string;
  toursCount: number;
  blurb: string;
};

export type ItineraryDay = {
  day: number;
  title: string;
  text: string;
};

export type Departure = {
  start: string;
  taken: number;
};

export type Tour = {
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
};

export type Continent =
  | "Европа"
  | "Азия"
  | "Африка"
  | "Америка"
  | "Океания";

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

export type Review = {
  id: string;
  tourSlug: string;
  userId: string;
  rating: number;
  title: string;
  text: string;
  date: string;
};

export type BookingStatus = "paid" | "confirmed" | "cancelled" | "completed";

export type Booking = {
  id: string;
  tourSlug: string;
  userId: string;
  guests: number;
  total: number;
  status: BookingStatus;
  paidAt: string;
  cardLast4: string;
  departureStart: string;
};

export type Conversation = {
  id: string;
  tourSlug: string;
  travelerId: string;
  organizerId: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};
