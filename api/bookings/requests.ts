import axios from "axios";
import { BOOKINGS, bookingUrl } from "../endpoints";
import type { CreateBookingInput, UpdateBookingInput } from "./request.type";
import type { IResponseBooking, IResponseBookings, IResponseBookingStatus } from "./response.type";

export const getBookings = async () => {
  const res = await axios.get<IResponseBookings>(BOOKINGS);
  return res.data;
};

export const createBooking = async (body: CreateBookingInput) => {
  const res = await axios.post<IResponseBooking>(BOOKINGS, body);
  return res.data;
};

export const updateBookingStatus = async (id: string, body: UpdateBookingInput) => {
  const res = await axios.patch<IResponseBookingStatus>(bookingUrl(id), body);
  return res.data;
};
