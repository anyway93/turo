export const AUTH_REGISTER = "/api/auth/register/";
export const AUTH_LOGIN = "/api/auth/login/";
export const AUTH_LOGOUT = "/api/auth/logout/";
export const AUTH_ME = "/api/auth/me/";
export const ACCOUNT = "/api/account/";
export const UPLOADS = "/api/uploads/";
export const TOURS = "/api/tours/";
export const DESTINATIONS = "/api/destinations/";
export const BOOKINGS = "/api/bookings/";
export const USERS = "/api/users/";
export const CONVERSATIONS = "/api/conversations/";

export const tourUrl = (slug: string) => `${TOURS}${encodeURIComponent(slug)}/`;

export const tourReviewsUrl = (slug: string) => `${tourUrl(slug)}reviews/`;

export const bookingUrl = (id: string) => `${BOOKINGS}${encodeURIComponent(id)}/`;

export const userUrl = (id: string) => `${USERS}${encodeURIComponent(id)}/`;

export const messagesUrl = (id: string) =>
  `${CONVERSATIONS}${encodeURIComponent(id)}/messages/`;
