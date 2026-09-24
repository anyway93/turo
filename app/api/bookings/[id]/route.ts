import { fail, ok } from "@/lib/server/http";
import { currentUser } from "@/lib/server/auth";
import { releaseSeats } from "@/lib/server/bookings";
import { prisma } from "@/lib/server/prisma";
import { readJson } from "@/lib/server/parse";

type Ctx = { params: Promise<{ id: string }> };

const statuses = new Set(["paid", "confirmed", "cancelled", "completed"]);

export async function PATCH(request: Request, ctx: Ctx) {
  const user = await currentUser();
  if (!user) return fail("error.login", 401);
  const { id } = await ctx.params;
  const booking = await prisma.booking.findUnique({ where: { id }, include: { tour: true } });
  if (!booking) return fail("error.tourMissing", 404);

  const body = await readJson(request);
  const status = body && typeof body === "object" ? (body as { status?: unknown }).status : "";
  if (typeof status !== "string" || !statuses.has(status)) return fail("error.badFields", 400);
  if (booking.status === status) return ok({ booking: bookingPayload(booking) });
  if (booking.status === "cancelled" || booking.status === "completed") return fail("error.forbidden", 403);

  const isOwner = booking.userId === user.id;
  const isHost = booking.tour.organizerId === user.id;
  const isAdmin = user.role === "admin";

  if (status === "cancelled") {
    if (!isOwner && !isHost && !isAdmin) return fail("error.forbidden", 403);
    if (isOwner && user.role !== "traveler" && !isAdmin) return fail("error.forbidden", 403);
  } else if (!isHost && !isAdmin) {
    return fail("error.forbidden", 403);
  }

  if (status === "cancelled") {
    await releaseSeats(booking.tourSlug, booking.departureStart, booking.guests);
  }
  const updated = await prisma.booking.update({ where: { id }, data: { status } });
  return ok({ booking: bookingPayload(updated) });
}

function bookingPayload(item: {
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
