import bcrypt from "bcryptjs";
import { Prisma, PrismaClient } from "@prisma/client";
import { bookings, conversations, destinations, messages, reviews, tours, users } from "../data";
import { hydrateTour, nextOpenStart } from "../data/dates";

const prisma = new PrismaClient();

async function main() {
  const passwordHashes = new Map<string, string>();
  for (const password of new Set(users.map((user) => user.password))) {
    passwordHashes.set(password, await bcrypt.hash(password, 10));
  }

  await prisma.chatMessage.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.departure.deleteMany();
  await prisma.tour.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: users.map((user) => ({
      id: user.id,
      email: user.email.toLowerCase(),
      passwordHash: passwordHashes.get(user.password) ?? "",
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      city: user.city,
      country: user.country,
      bio: user.bio,
      languages: user.languages,
      rating: user.rating,
      reviewsCount: user.reviewsCount,
      yearsGuiding: user.yearsGuiding ?? null,
    })),
  });

  await prisma.destination.createMany({
    data: destinations.map((item) => ({
      slug: item.slug,
      name: item.name,
      country: item.country,
      continent: item.continent,
      image: item.image,
      blurb: item.blurb,
    })),
  });

  const hydrated = tours.map((tour) => hydrateTour(tour));
  for (const tour of hydrated) {
    await prisma.tour.create({
      data: {
        slug: tour.slug,
        title: tour.title,
        subtitle: tour.subtitle,
        country: tour.country,
        city: tour.city,
        continent: tour.continent,
        destinationSlug: tour.destinationSlug,
        organizerId: tour.organizerId,
        durationDays: tour.durationDays,
        price: tour.price,
        seats: tour.seats,
        difficulty: tour.difficulty,
        style: tour.style,
        tags: tour.tags,
        cover: tour.cover,
        gallery: tour.gallery,
        included: tour.included,
        excluded: tour.excluded,
        itinerary: tour.itinerary as unknown as Prisma.InputJsonValue,
        meetingPoint: tour.meetingPoint,
        cancellation: tour.cancellation,
        rating: tour.rating,
        reviewsCount: tour.reviewsCount,
        source: "seed",
        departures: {
          create: tour.departures.map((item) => ({ start: item.start, taken: item.taken })),
        },
      },
    });
  }

  const tourBySlug = new Map(hydrated.map((tour) => [tour.slug, tour]));
  const userIds = new Set(users.map((user) => user.id));

  await prisma.review.createMany({
    data: reviews
      .filter((review) => tourBySlug.has(review.tourSlug) && userIds.has(review.userId))
      .map((review) => ({
        id: review.id,
        tourSlug: review.tourSlug,
        userId: review.userId,
        rating: review.rating,
        title: review.title,
        text: review.text,
        date: review.date,
      })),
  });

  await prisma.booking.createMany({
    data: bookings
      .filter((booking) => tourBySlug.has(booking.tourSlug) && userIds.has(booking.userId))
      .map((booking) => {
        const tour = tourBySlug.get(booking.tourSlug)!;
        return {
          id: booking.id,
          tourSlug: booking.tourSlug,
          userId: booking.userId,
          guests: booking.guests,
          total: booking.total,
          status: booking.status,
          paidAt: new Date(booking.paidAt),
          cardLast4: booking.cardLast4,
          departureStart: booking.departureStart || nextOpenStart(tour) || tour.startDate,
        };
      }),
  });

  const conversationIds = new Set<string>();
  await prisma.conversation.createMany({
    data: conversations
      .filter(
        (item) =>
          tourBySlug.has(item.tourSlug) && userIds.has(item.travelerId) && userIds.has(item.organizerId),
      )
      .map((item) => {
        conversationIds.add(item.id);
        return {
          id: item.id,
          tourSlug: item.tourSlug,
          travelerId: item.travelerId,
          organizerId: item.organizerId,
        };
      }),
  });

  await prisma.chatMessage.createMany({
    data: messages
      .filter((item) => conversationIds.has(item.conversationId) && userIds.has(item.senderId))
      .map((item) => ({
        id: item.id,
        conversationId: item.conversationId,
        senderId: item.senderId,
        text: item.text,
        createdAt: new Date(item.createdAt),
      })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
