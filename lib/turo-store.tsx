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
  type Booking,
  type ChatMessage,
  type Conversation,
  type Tour,
  type User,
} from "@/data";
import type { UserRole as Role } from "@/data/types";

const KEY = "turo-live-v1";

type Persist = {
  sessionUserId: string | null;
  extraUsers: User[];
  extraTours: Tour[];
  extraBookings: Booking[];
  extraConversations: Conversation[];
  extraMessages: ChatMessage[];
  seatTaken: Record<string, number>;
};

const empty: Persist = {
  sessionUserId: null,
  extraUsers: [],
  extraTours: [],
  extraBookings: [],
  extraConversations: [],
  extraMessages: [],
  seatTaken: {},
};

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  city: string;
};

type BookInput = {
  tourSlug: string;
  guests: number;
  cardLast4: string;
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
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
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

  const users = useMemo(
    () => [...seedUsers, ...persist.extraUsers],
    [persist.extraUsers],
  );

  const tours = useMemo(
    () =>
      [...seedTours, ...persist.extraTours].map((tour) => ({
        ...tour,
        seatsTaken: tour.seatsTaken + (persist.seatTaken[tour.slug] ?? 0),
      })),
    [persist.extraTours, persist.seatTaken],
  );

  const bookings = useMemo(
    () => [...seedBookings, ...persist.extraBookings],
    [persist.extraBookings],
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
      role: "both",
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
      const tour = tours.find((item) => item.slug === input.tourSlug);
      if (!tour) return { ok: false, error: "error.tourMissing" };
      if (current.id === tour.organizerId) {
        return { ok: false, error: "error.ownTour" };
      }
      const left = tour.seats - tour.seatsTaken;
      if (input.guests < 1 || input.guests > left) {
        return { ok: false, error: "error.noSeats" };
      }
      const already = bookings.find(
        (item) =>
          item.userId === current.id &&
          item.tourSlug === tour.slug &&
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
          [tour.slug]: (prev.seatTaken[tour.slug] ?? 0) + input.guests,
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
      const slug =
        input.slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase() || uid("tour");
      if (tours.some((item) => item.slug === slug)) {
        return { ok: false, error: "error.slugTaken" };
      }
      const tour: Tour = {
        ...input,
        slug,
        organizerId: current.id,
        seatsTaken: 0,
        rating: 5,
        reviewsCount: 0,
        source: "user",
      };
      setPersist((prev) => ({
        ...prev,
        extraTours: [...prev.extraTours, tour],
      }));
      return { ok: true, tour };
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
