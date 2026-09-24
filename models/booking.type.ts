export type BookingStatus = "paid" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  id: string;
  tourSlug: string;
  userId: string;
  guests: number;
  total: number;
  status: BookingStatus;
  paidAt: string;
  cardLast4: string;
  departureStart: string;
}
