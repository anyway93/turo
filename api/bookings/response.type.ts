import type { Booking } from "@/models";

export interface IResponseBookings {
  ok: true;
  bookings: Booking[];
}

export interface IResponseBooking {
  ok: true;
  booking: Booking | null;
  conversationId: string;
}

export interface IResponseBookingStatus {
  ok: true;
  booking: Booking;
}
