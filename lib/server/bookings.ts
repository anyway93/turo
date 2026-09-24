import { prisma } from "./prisma";
import { uid } from "./parse";

type BookResult =
  | { ok: true; bookingId: string; conversationId: string }
  | { ok: false; error: string };

export async function createBooking(input: {
  userId: string;
  tourSlug: string;
  guests: number;
  cardLast4: string;
  departureStart: string;
}): Promise<BookResult> {
  try {
    return await prisma.$transaction(async (tx) => {
      const tour = await tx.tour.findFirst({
        where: { slug: input.tourSlug, deletedAt: null },
      });
      if (!tour) return { ok: false, error: "error.tourMissing" };
      if (tour.organizerId === input.userId) return { ok: false, error: "error.ownTour" };

      const duplicate = await tx.booking.findFirst({
        where: {
          userId: input.userId,
          tourSlug: tour.slug,
          departureStart: input.departureStart,
          status: { not: "cancelled" },
        },
      });
      if (duplicate) return { ok: false, error: "error.alreadyBooked" };

      const reserved = await tx.departure.updateMany({
        where: {
          tourSlug: tour.slug,
          start: input.departureStart,
          taken: { lte: tour.seats - input.guests },
        },
        data: { taken: { increment: input.guests } },
      });
      if (reserved.count !== 1) return { ok: false, error: "error.noSeats" };

      const booking = await tx.booking.create({
        data: {
          id: uid("bk"),
          tourSlug: tour.slug,
          userId: input.userId,
          guests: input.guests,
          total: tour.price * input.guests,
          status: "paid",
          paidAt: new Date(),
          cardLast4: input.cardLast4,
          departureStart: input.departureStart,
        },
      });

      const existing = await tx.conversation.findUnique({
        where: {
          tourSlug_travelerId_organizerId: {
            tourSlug: tour.slug,
            travelerId: input.userId,
            organizerId: tour.organizerId,
          },
        },
      });
      const conversation =
        existing ??
        (await tx.conversation.create({
          data: {
            id: uid("conv"),
            tourSlug: tour.slug,
            travelerId: input.userId,
            organizerId: tour.organizerId,
          },
        }));

      await tx.chatMessage.create({
        data: {
          id: uid("msg"),
          conversationId: conversation.id,
          senderId: input.userId,
          text: `__TURO_PAID__|${tour.title}|${input.guests}`,
          createdAt: new Date(),
        },
      });

      return { ok: true, bookingId: booking.id, conversationId: conversation.id };
    });
  } catch {
    return { ok: false, error: "error.noSeats" };
  }
}

export async function releaseSeats(tourSlug: string, start: string, guests: number) {
  const departure = await prisma.departure.findUnique({
    where: { tourSlug_start: { tourSlug, start } },
  });
  if (!departure) return;
  await prisma.departure.update({
    where: { id: departure.id },
    data: { taken: Math.max(0, departure.taken - guests) },
  });
}
