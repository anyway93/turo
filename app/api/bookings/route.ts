import { fail, ok } from "@/lib/server/http";
import { currentUser } from "@/lib/server/auth";
import { createBooking } from "@/lib/server/bookings";
import { prisma } from "@/lib/server/prisma";
import { readJson } from "@/lib/server/parse";

function toBooking(item: {
  id: string;
  tourSlug: string;
  userId: string;
  guests: number;
  total: number;
  status: string;
  paidAt: Date;
  cardLast4: string;
  departureStart: string;
}) {
  return {
    id: item.id,
    tourSlug: item.tourSlug,
    userId: item.userId,
    guests: item.guests,
    total: item.total,
    status: item.status,
    paidAt: item.paidAt.toISOString(),
    cardLast4: item.cardLast4,
    departureStart: item.departureStart,
  };
}

export async function GET() {
  const user = await currentUser();
  if (!user) return fail("error.login", 401);

  const where =
    user.role === "admin"
      ? {}
      : user.role === "organizer"
        ? { tour: { organizerId: user.id } }
        : { userId: user.id };

  const bookings = await prisma.booking.findMany({ where, orderBy: { paidAt: "desc" } });
  return ok({ bookings: bookings.map(toBooking) });
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return fail("error.loginToPay", 401);
  if (user.role !== "traveler") return fail("error.roleBook", 403);

  const body = await readJson(request);
  if (!body || typeof body !== "object") return fail("error.badFields", 400);
  const input = body as Record<string, unknown>;
  const tourSlug = typeof input.tourSlug === "string" ? input.tourSlug : "";
  const departureStart = typeof input.departureStart === "string" ? input.departureStart : "";
  const guests = Math.round(Number(input.guests));
  const digits = typeof input.cardLast4 === "string" ? input.cardLast4.replace(/\D/g, "") : "";
  const cardLast4 = digits.slice(-4);
  if (!tourSlug || !/^\d{4}-\d{2}-\d{2}$/.test(departureStart) || guests < 1) return fail("error.badFields", 400);
  if (cardLast4.length !== 4) return fail("error.badFields", 400);

  const result = await createBooking({ userId: user.id, tourSlug, guests, cardLast4, departureStart });
  if (!result.ok) return fail(result.error, result.error === "error.tourMissing" ? 404 : 400);
  const booking = await prisma.booking.findUnique({ where: { id: result.bookingId } });
  return ok({ booking: booking ? toBooking(booking) : null, conversationId: result.conversationId }, 201);
}
