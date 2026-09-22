import type { User, UserRole } from "@/data/types";

export type NavLink = { href: string; labelKey: string };

export function canBook(role?: UserRole | null) {
  return role === "traveler";
}

export function canHost(role?: UserRole | null) {
  return role === "organizer" || role === "admin";
}

export function canModerate(role?: UserRole | null) {
  return role === "admin";
}

export function canManageTour(user: User | null | undefined, organizerId: string) {
  if (!user) return false;
  if (user.role === "admin") return true;
  return user.role === "organizer" && user.id === organizerId;
}

export function headerLinks(role?: UserRole | null): NavLink[] {
  if (role === "traveler") {
    return [
      { href: "/tours/", labelKey: "header.tours" },
      { href: "/#how", labelKey: "header.how" },
    ];
  }
  if (role === "organizer") {
    return [
      { href: "/account/tours/", labelKey: "header.myTours" },
      { href: "/create/", labelKey: "header.create" },
    ];
  }
  if (role === "admin") {
    return [
      { href: "/account/tours/", labelKey: "header.tours" },
      { href: "/account/users/", labelKey: "header.users" },
      { href: "/create/", labelKey: "header.create" },
    ];
  }
  return [
    { href: "/tours/", labelKey: "header.tours" },
    { href: "/create/", labelKey: "header.create" },
    { href: "/#how", labelKey: "header.how" },
  ];
}

export function accountMenu(role: UserRole): NavLink[] {
  if (role === "traveler") {
    return [
      { href: "/account/", labelKey: "header.account" },
      { href: "/account/bookings/", labelKey: "header.bookings" },
      { href: "/messages/", labelKey: "header.messages" },
    ];
  }
  if (role === "organizer") {
    return [
      { href: "/account/", labelKey: "header.account" },
      { href: "/account/tours/", labelKey: "header.myTours" },
      { href: "/create/", labelKey: "header.publish" },
      { href: "/messages/", labelKey: "header.messages" },
    ];
  }
  return [
    { href: "/account/", labelKey: "header.account" },
    { href: "/account/tours/", labelKey: "header.tours" },
    { href: "/account/users/", labelKey: "header.users" },
    { href: "/create/", labelKey: "header.publish" },
    { href: "/messages/", labelKey: "header.messages" },
  ];
}

export function accountNav(role: UserRole): NavLink[] {
  if (role === "traveler") {
    return [
      { href: "/account/", labelKey: "account.profile" },
      { href: "/account/bookings/", labelKey: "account.bookings" },
      { href: "/messages/", labelKey: "account.messages" },
    ];
  }
  if (role === "organizer") {
    return [
      { href: "/account/", labelKey: "account.profile" },
      { href: "/account/tours/", labelKey: "account.tours" },
      { href: "/messages/", labelKey: "account.messages" },
    ];
  }
  return [
    { href: "/account/", labelKey: "account.profile" },
    { href: "/account/tours/", labelKey: "account.toursAll" },
    { href: "/account/users/", labelKey: "account.users" },
    { href: "/account/bookings/", labelKey: "account.allBookings" },
    { href: "/messages/", labelKey: "account.messages" },
  ];
}
