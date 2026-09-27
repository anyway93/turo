import type { BookingStatus } from "@/models";

export interface CreateBookingInput {
  tourSlug: string;
  departureStart: string;
  guests: number;
  cardLast4: string;
}

export interface UpdateBookingInput {
  status: BookingStatus;
}
