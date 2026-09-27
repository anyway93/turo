export type { ApiUser, IResponseOk } from "./types";

export {
  AUTH_REGISTER,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_ME,
  ACCOUNT,
  UPLOADS,
  TOURS,
  DESTINATIONS,
  BOOKINGS,
  USERS,
  CONVERSATIONS,
  tourUrl,
  tourReviewsUrl,
  bookingUrl,
  userUrl,
  messagesUrl,
} from "./endpoints";

export { register, login, logout, getMe } from "./auth";
export type { LoginInput, RegisterInput, IResponseSession, IResponseMe } from "./auth";

export { updateAccount } from "./account";
export type { UpdateAccountInput, IResponseAccount } from "./account";

export { uploadImage } from "./uploads";
export type { IResponseUpload } from "./uploads";

export {
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourReviews,
  createTourReview,
} from "./tours";
export type {
  ToursQuery,
  CreateTourInput,
  UpdateTourInput,
  CreateReviewInput,
  IResponseTours,
  IResponseTour,
  IResponseReviews,
  IResponseReview,
} from "./tours";

export { getDestinations } from "./destinations";
export type { IResponseDestinations } from "./destinations";

export { getBookings, createBooking, updateBookingStatus } from "./bookings";
export type {
  CreateBookingInput,
  UpdateBookingInput,
  IResponseBookings,
  IResponseBooking,
  IResponseBookingStatus,
} from "./bookings";

export { getUsers, getUser, updateUser, deleteUser } from "./users";
export type { UpdateUserInput, IResponseUsers, IResponseUser } from "./users";

export { getConversations, openConversation, getMessages, sendMessage } from "./conversations";
export type {
  OpenConversationInput,
  SendMessageInput,
  IResponseConversations,
  IResponseConversation,
  IResponseMessages,
  IResponseMessage,
} from "./conversations";
