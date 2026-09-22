"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  bookings as seedBookings,
  conversations as seedConversations,
  messages as seedMessages,
  tours as seedTours,
  users as seedUsers,
  hydrateTour,
  leftover,
  nextOpenStart,
  seatKey,
  type Booking,
  type ChatMessage,
  type Conversation,
  type Tour,
  type User,
} from "@/data";
import type { UserRole as Role } from "@/data/types";
import { canBook, canHost, canManageTour, canModerate } from "@/lib/access";

const KEY = "turo-live-v1";

type TourPatch = Partial<
  Pick<Tour, "title" | "subtitle" | "city" | "country" | "price" | "seats" | "meetingPoint">
>;

type UserPatch = Partial<Pick<User, "name" | "city" | "bio" | "role">>;

type Persist = {
  sessionUserId: string | null;
  extraUsers: User[];
  extraTours: Tour[];
  extraBookings: Booking[];
  extraConversations: Conversation[];
  extraMessages: ChatMessage[];
  seatTaken: Record<string, number>;
  removedTourSlugs: string[];
  tourPatches: Record<string, TourPatch>;
  removedUserIds: string[];
  userPatches: Record<string, UserPatch>;
};

const empty: Persist = {
  sessionUserId: null,
  extraUsers: [],
  extraTours: [],
  extraBookings: [],
  extraConversations: [],
  extraMessages: [],
  seatTaken: {},
  removedTourSlugs: [],
  tourPatches: {},
  removedUserIds: [],
  userPatches: {},
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  city: string;
  role: "traveler" | "organizer";
};

type BookInput = {
  tourSlug: string;
  guests: number;
  cardLast4: string;
  departureStart: string;
};

type CreateTourInput = Omit<Tour, "source" | "seatsTaken" | "rating" | "reviewsCount" | "organizerId">;

type StoreApi = {
  ready: boolean;
  user: User | null;
  users: User[];
  tours: Tour[];
  bookings: Booking[];
  conversations: Conversation[];
  messages: ChatMessage[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (input: RegisterInput) => { ok: boolean; error?: string };
  logout: () => void;
  book: (input: BookInput) => { ok: boolean; error?: string; conversationId?: string; bookingId?: string };
  createTour: (input: CreateTourInput) => { ok: boolean; error?: string; tour?: Tour };
  updateTour: (slug: string, patch: TourPatch) => { ok: boolean; error?: string };
  deleteTour: (slug: string) => { ok: boolean; error?: string };
  updateUser: (id: string, patch: UserPatch) => { ok: boolean; error?: string };
  deleteUser: (id: string) => { ok: boolean; error?: string };
  sendMessage: (conversationId: string, text: string) => void;
  userById: (id: string) => User | undefined;
  tourBySlug: (slug: string) => Tour | undefined;
  ensureChat: (tourSlug: string) => { ok: boolean; error?: string; conversationId?: string };
};

const StoreContext = createContext<StoreApi | null>(null);

function readPersist(): Persist {
  if (typeof window === "undefined") return empty;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = { ...empty, ...JSON.parse(raw) } as Persist;
    return {
      ...parsed,
      removedTourSlugs: parsed.removedTourSlugs ?? [],
      tourPatches: parsed.tourPatches ?? {},
      removedUserIds: parsed.removedUserIds ?? [],
      userPatches: parsed.userPatches ?? {},
    };
  } catch {
    return empty;
  }
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function asRole(role: string): Role {
  if (role === "traveler" || role === "organizer" || role === "admin") return role;
  return "organizer";
}

function normalizeUser(user: User): User {
  return { ...user, role: asRole(user.role) };
}

function applySeats(tour: Tour, seatTaken: Record<string, number>): Tour {
  const live = hydrateTour(tour);
  const extra = new Map<string, number>();
  for (const [key, count] of Object.entries(seatTaken)) {
    if (key === live.slug) {
      const first = live.departures[0]?.start;
      if (first) extra.set(first, (extra.get(first) ?? 0) + count);
    } else if (key.startsWith(`${live.slug}::`)) {
      const start = key.slice(live.slug.length + 2);
      extra.set(start, (extra.get(start) ?? 0) + count);
    }
  }
  const departures = live.departures.map((item) => ({
    ...item,
    taken: item.taken + (extra.get(item.start) ?? 0),
  }));
  return {
    ...live,
    departures,
    seatsTaken: departures.reduce((sum, item) => sum + item.taken, 0),
  };
}

export function TuroProvider({ children }: { children: ReactNode }) {
  const [persist, setPersist] = useState<Persist>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPersist(readPersist());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(persist));
  }, [persist, ready]);

  const users = useMemo(() => {
    const removed = new Set(persist.removedUserIds);
    return [...seedUsers, ...persist.extraUsers]
      .filter((item) => !removed.has(item.id))
      .map((item) => normalizeUser({ ...item, ...persist.userPatches[item.id] }));
  }, [persist.extraUsers, persist.removedUserIds, persist.userPatches]);

  const tours = useMemo(() => {
    const removed = new Set(persist.removedTourSlugs);
    return [...seedTours, ...persist.extraTours]
      .filter((tour) => !removed.has(tour.slug))
      .map((tour) => applySeats({ ...tour, ...persist.tourPatches[tour.slug] }, persist.seatTaken));
  }, [persist.extraTours, persist.removedTourSlugs, persist.seatTaken, persist.tourPatches]);

  const bookings = useMemo(
    () =>
      [...seedBookings, ...persist.extraBookings].map((item) => {
        if (item.departureStart) return item;
        const tour = tours.find((entry) => entry.slug === item.tourSlug);
        return { ...item, departureStart: tour ? nextOpenStart(tour) ?? tour.startDate : "" };
      }),
    [persist.extraBookings, tours],
  );

  const conversations = useMemo(
    () => [...seedConversations, ...persist.extraConversations],
    [persist.extraConversations],
  );

  const messages = useMemo(
    () => [...seedMessages, ...persist.extraMessages],
    [persist.extraMessages],
  );

  const user = users.find((item) => item.id === persist.sessionUserId) ?? null;

  const userById = useCallback(
    (id: string) => users.find((item) => item.id === id),
    [users],
  );

  const tourBySlug = useCallback(
    (slug: string) => tours.find((item) => item.slug === slug),
    [tours],
  );

  const login = useCallback(
    (email: string, password: string) => {
      const found = users.find(
        (item) =>
          item.email.toLowerCase() === email.trim().toLowerCase() &&
          item.password === password,
      );
      if (!found) return { ok: false, error: "error.badCredentials" };
      setPersist((prev) => ({ ...prev, sessionUserId: found.id }));
      return { ok: true };
    },
    [users],
  );

  const register = useCallback((input: RegisterInput) => {
    const email = input.email.trim().toLowerCase();
    const exists = [...seedUsers, ...readPersist().extraUsers].some(
      (item) => item.email.toLowerCase() === email,
    );
    if (exists) return { ok: false, error: "error.emailTaken" };
    if (input.password.length < 6) {
      return { ok: false, error: "error.shortPassword" };
    }
    const created: User = {
      id: uid("usr"),
      email,
      password: input.password,
      name: input.name.trim(),
      role: input.role === "organizer" ? "organizer" : "traveler",
      avatar: "",
      city: input.city.trim() || "—",
      country: "—",
      bio: "Новый профиль на Turo.",
      languages: ["Русский"],
      rating: 5,
      reviewsCount: 0,
    };
    setPersist((prev) => ({
      ...prev,
      extraUsers: [...prev.extraUsers, created],
      sessionUserId: created.id,
    }));
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setPersist((prev) => ({ ...prev, sessionUserId: null }));
  }, []);

  const book = useCallback(
    (input: BookInput) => {
      const current = users.find((item) => item.id === persist.sessionUserId);
      if (!current) return { ok: false, error: "error.loginToPay" };
      if (!canBook(current.role)) return { ok: false, error: "error.roleBook" };
      const tour = tours.find((item) => item.slug === input.tourSlug);
      if (!tour) return { ok: false, error: "error.tourMissing" };
      if (current.id === tour.organizerId) {
        return { ok: false, error: "error.ownTour" };
      }
      const left = leftover(tour, input.departureStart);
      if (input.guests < 1 || input.guests > left) {
        return { ok: false, error: "error.noSeats" };
      }
      const already = bookings.find(
        (item) =>
          item.userId === current.id &&
          item.tourSlug === tour.slug &&
          item.departureStart === input.departureStart &&
          item.status !== "cancelled",
      );
      const booking: Booking = {
        id: uid("bk"),
        tourSlug: tour.slug,
        userId: current.id,
        guests: input.guests,
        total: tour.price * input.guests,
        status: "paid",
        paidAt: new Date().toISOString(),
        cardLast4: input.cardLast4,
        departureStart: input.departureStart,
      };
      const existingChat = conversations.find(
        (item) =>
          item.tourSlug === tour.slug &&
          item.travelerId === current.id &&
          item.organizerId === tour.organizerId,
      );
      const conversation =
        existingChat ??
        ({
          id: uid("conv"),
          tourSlug: tour.slug,
          travelerId: current.id,
          organizerId: tour.organizerId,
        } satisfies Conversation);
      const hello: ChatMessage = {
        id: uid("msg"),
        conversationId: conversation.id,
        senderId: current.id,
        text: `__TURO_PAID__|${tour.title}|${input.guests}`,
        createdAt: new Date().toISOString(),
      };
      setPersist((prev) => ({
        ...prev,
        extraBookings: [...prev.extraBookings, booking],
        extraConversations: existingChat
          ? prev.extraConversations
          : [...prev.extraConversations, conversation],
        extraMessages: [...prev.extraMessages, hello],
        seatTaken: {
          ...prev.seatTaken,
          [seatKey(tour.slug, input.departureStart)]:
            (prev.seatTaken[seatKey(tour.slug, input.departureStart)] ?? 0) + input.guests,
        },
      }));
      void already;
      return { ok: true, conversationId: conversation.id, bookingId: booking.id };
    },
    [bookings, conversations, persist.sessionUserId, tours, users],
  );

  const createTour = useCallback(
    (input: CreateTourInput) => {
      const current = users.find((item) => item.id === persist.sessionUserId);
      if (!current) return { ok: false, error: "error.loginToPublish" };
      if (!canHost(current.role)) return { ok: false, error: "error.roleHost" };
      const slug =
        input.slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase() || uid("tour");
      if (tours.some((item) => item.slug === slug)) {
        return { ok: false, error: "error.slugTaken" };
      }
      const tour: Tour = hydrateTour({
        ...input,
        slug,
        organizerId: current.id,
        seatsTaken: 0,
        rating: 5,
        reviewsCount: 0,
        source: "user",
      });
      setPersist((prev) => ({
        ...prev,
        extraTours: [...prev.extraTours, tour],
      }));
      return { ok: true, tour };
    },
    [persist.sessionUserId, tours, users],
  );

  const updateTour = useCallback(
    (slug: string, patch: TourPatch) => {
      const current = users.find((item) => item.id === persist.sessionUserId);
      const tour = tours.find((item) => item.slug === slug);
      if (!current || !tour || !canManageTour(current, tour.organizerId)) {
        return { ok: false, error: "error.forbidden" };
      }
      const next: TourPatch = {};
      if (patch.title !== undefined) {
        const title = patch.title.trim();
        if (!title) return { ok: false, error: "error.badFields" };
        next.title = title;
      }
      if (patch.subtitle !== undefined) next.subtitle = patch.subtitle.trim();
      if (patch.city !== undefined) next.city = patch.city.trim() || tour.city;
      if (patch.country !== undefined) next.country = patch.country.trim() || tour.country;
      if (patch.meetingPoint !== undefined) next.meetingPoint = patch.meetingPoint.trim();
      if (patch.price !== undefined) {
        if (!Number.isFinite(patch.price) || patch.price < 1) {
          return { ok: false, error: "error.badFields" };
        }
        next.price = Math.round(patch.price);
      }
      if (patch.seats !== undefined) {
        const seats = Math.round(patch.seats);
        if (seats < 1 || seats < tour.seatsTaken) {
          return { ok: false, error: "error.seatsLow" };
        }
        next.seats = seats;
      }
      setPersist((prev) => ({
        ...prev,
        tourPatches: {
          ...prev.tourPatches,
          [slug]: { ...prev.tourPatches[slug], ...next },
        },
      }));
      return { ok: true };
    },
    [persist.sessionUserId, tours, users],
  );

  const deleteTour = useCallback(
    (slug: string) => {
      const current = users.find((item) => item.id === persist.sessionUserId);
      const tour = tours.find((item) => item.slug === slug);
      if (!current || !tour || !canManageTour(current, tour.organizerId)) {
        return { ok: false, error: "error.forbidden" };
      }
      setPersist((prev) => ({
        ...prev,
        removedTourSlugs: prev.removedTourSlugs.includes(slug)
          ? prev.removedTourSlugs
          : [...prev.removedTourSlugs, slug],
        extraTours: prev.extraTours.filter((item) => item.slug !== slug),
      }));
      return { ok: true };
    },
    [persist.sessionUserId, tours, users],
  );

  const updateUser = useCallback(
    (id: string, patch: UserPatch) => {
      const current = users.find((item) => item.id === persist.sessionUserId);
      const target = users.find((item) => item.id === id);
      if (!current || !canModerate(current.role) || !target) {
        return { ok: false, error: "error.forbidden" };
      }
      const next: UserPatch = {};
      if (patch.name !== undefined) {
        const name = patch.name.trim();
        if (!name) return { ok: false, error: "error.badFields" };
        next.name = name;
      }
      if (patch.city !== undefined) next.city = patch.city.trim() || "—";
      if (patch.bio !== undefined) next.bio = patch.bio.trim();
      if (patch.role !== undefined) {
        if (patch.role !== "traveler" && patch.role !== "organizer" && patch.role !== "admin") {
          return { ok: false, error: "error.forbidden" };
        }
        if (id === current.id && patch.role !== current.role) {
          return { ok: false, error: "error.ownRole" };
        }
        const admins = users.filter((item) => item.role === "admin").length;
        if (target.role === "admin" && patch.role !== "admin" && admins <= 1) {
          return { ok: false, error: "error.lastAdmin" };
        }
        next.role = patch.role;
      }
      setPersist((prev) => ({
        ...prev,
        userPatches: {
          ...prev.userPatches,
          [id]: { ...prev.userPatches[id], ...next },
        },
      }));
      return { ok: true };
    },
    [persist.sessionUserId, users],
  );

  const deleteUser = useCallback(
    (id: string) => {
      const current = users.find((item) => item.id === persist.sessionUserId);
      const target = users.find((item) => item.id === id);
      if (!current || !canModerate(current.role) || !target) {
        return { ok: false, error: "error.forbidden" };
      }
      if (id === current.id) return { ok: false, error: "error.ownDelete" };
      if (target.role === "admin" && users.filter((item) => item.role === "admin").length <= 1) {
        return { ok: false, error: "error.lastAdmin" };
      }
      if (tours.some((item) => item.organizerId === id)) {
        return { ok: false, error: "error.userHasTours" };
      }
      setPersist((prev) => ({
        ...prev,
        removedUserIds: prev.removedUserIds.includes(id) ? prev.removedUserIds : [...prev.removedUserIds, id],
        extraUsers: prev.extraUsers.filter((item) => item.id !== id),
        sessionUserId: prev.sessionUserId === id ? null : prev.sessionUserId,
      }));
      return { ok: true };
    },
    [persist.sessionUserId, tours, users],
  );

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const currentId = persist.sessionUserId;
    if (!currentId || !text.trim()) return;
    const message: ChatMessage = {
      id: uid("msg"),
      conversationId,
      senderId: currentId,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };
    setPersist((prev) => ({
      ...prev,
      extraMessages: [...prev.extraMessages, message],
    }));
  }, [persist.sessionUserId]);

  const ensureChat = useCallback(
    (tourSlug: string) => {
      const current = users.find((item) => item.id === persist.sessionUserId);
      if (!current) return { ok: false, error: "error.login" };
      const tour = tours.find((item) => item.slug === tourSlug);
      if (!tour) return { ok: false, error: "error.tourMissing" };
      const paid = bookings.some(
        (item) =>
          item.userId === current.id &&
          item.tourSlug === tourSlug &&
          item.status !== "cancelled",
      );
      if (!paid && current.id !== tour.organizerId) {
        return { ok: false, error: "error.chatAfterPay" };
      }
      const travelerId =
        current.id === tour.organizerId ? current.id : current.id;
      if (current.id === tour.organizerId) {
        return { ok: false, error: "error.chatFromList" };
      }
      const existing = conversations.find(
        (item) =>
          item.tourSlug === tourSlug &&
          item.travelerId === travelerId &&
          item.organizerId === tour.organizerId,
      );
      if (existing) return { ok: true, conversationId: existing.id };
      return { ok: false, error: "error.chatAfterPay2" };
    },
    [bookings, conversations, persist.sessionUserId, tours, users],
  );

  const value = useMemo<StoreApi>(
    () => ({
      ready,
      user,
      users,
      tours,
      bookings,
      conversations,
      messages,
      login,
      register,
      logout,
      book,
      createTour,
      updateTour,
      deleteTour,
      updateUser,
      deleteUser,
      sendMessage,
      userById,
      tourBySlug,
      ensureChat,
    }),
    [
      ready,
      user,
      users,
      tours,
      bookings,
      conversations,
      messages,
      login,
      register,
      logout,
      book,
      createTour,
      updateTour,
      deleteTour,
      updateUser,
      deleteUser,
      sendMessage,
      userById,
      tourBySlug,
      ensureChat,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useTuro() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useTuro must be used within TuroProvider");
  return ctx;
}

export type { Role as UserRole };
