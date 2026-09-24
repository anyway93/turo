import { fail, ok } from "@/lib/server/http";
import { currentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { asStringList, isContinent, isDifficulty, isStyle, readJson, slugify, uid } from "@/lib/server/parse";
import { toTour, tourInclude } from "@/lib/server/tours";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const where: Prisma.TourWhereInput = { deletedAt: null };
  const continent = url.searchParams.get("continent");
  const style = url.searchParams.get("style");
  const difficulty = url.searchParams.get("difficulty");
  const destination = url.searchParams.get("destination");
  const q = url.searchParams.get("q")?.trim();
  const mine = url.searchParams.get("mine");

  if (continent && continent !== "all") where.continent = continent;
  if (style && style !== "all") where.style = style;
  if (difficulty && difficulty !== "all") where.difficulty = difficulty;
  if (destination) where.destinationSlug = destination;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
      { country: { contains: q, mode: "insensitive" } },
      { subtitle: { contains: q, mode: "insensitive" } },
    ];
  }
  if (mine === "1") {
    const user = await currentUser();
    if (!user) return fail("error.login", 401);
    if (user.role !== "admin") where.organizerId = user.id;
  }

  const tours = await prisma.tour.findMany({
    where,
    include: tourInclude,
    orderBy: { title: "asc" },
  });
  return ok({ tours: tours.map(toTour) });
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return fail("error.loginToPublish", 401);
  if (user.role !== "organizer" && user.role !== "admin") return fail("error.roleHost", 403);

  const body = await readJson(request);
  if (!body || typeof body !== "object") return fail("error.badFields", 400);
  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const city = typeof input.city === "string" ? input.city.trim() : "";
  const country = typeof input.country === "string" ? input.country.trim() : "";
  const continent = typeof input.continent === "string" ? input.continent : "";
  const difficulty = typeof input.difficulty === "string" ? input.difficulty : "";
  const style = typeof input.style === "string" ? input.style : "";
  const price = Number(input.price);
  const seats = Math.round(Number(input.seats));
  const durationDays = Math.round(Number(input.durationDays));
  const cover = typeof input.cover === "string" ? input.cover.trim() : "";
  if (!title || !city || !country || !cover) return fail("error.badFields", 400);
  if (!isContinent(continent) || !isDifficulty(difficulty) || !isStyle(style)) return fail("error.badFields", 400);
  if (!Number.isFinite(price) || price < 1 || seats < 1 || durationDays < 1) return fail("error.badFields", 400);

  const requested = typeof input.slug === "string" ? slugify(input.slug) : "";
  const slug = requested || slugify(title) || uid("tour");
  const taken = await prisma.tour.findUnique({ where: { slug } });
  if (taken) return fail("error.slugTaken", 409);

  const starts = Array.isArray(input.departures)
    ? input.departures
        .map((item) => (item && typeof item === "object" && "start" in item ? String((item as { start: unknown }).start) : ""))
        .filter((start) => /^\d{4}-\d{2}-\d{2}$/.test(start))
    : [];
  const startDate = typeof input.startDate === "string" ? input.startDate : "";
  const dates = [...new Set(starts.length ? starts : startDate ? [startDate] : [])];
  if (!dates.length) return fail("error.badFields", 400);

  const tags = asStringList(input.tags) ?? [style];
  const gallery = asStringList(input.gallery) ?? [];
  const included = asStringList(input.included) ?? [];
  const excluded = asStringList(input.excluded) ?? [];
  const itinerary = Array.isArray(input.itinerary) ? input.itinerary : [];

  const tour = await prisma.tour.create({
    data: {
      slug,
      title,
      subtitle: typeof input.subtitle === "string" ? input.subtitle.trim() : "",
      country,
      city,
      continent,
      destinationSlug: typeof input.destinationSlug === "string" && input.destinationSlug.trim() ? input.destinationSlug.trim() : slug,
      organizerId: user.id,
      durationDays,
      price: Math.round(price),
      seats,
      difficulty,
      style,
      tags,
      cover,
      gallery,
      included,
      excluded,
      itinerary,
      meetingPoint: typeof input.meetingPoint === "string" ? input.meetingPoint.trim() : "",
      cancellation: typeof input.cancellation === "string" && input.cancellation.trim() ? input.cancellation.trim() : "Бесплатная отмена за 14 дней",
      rating: 5,
      reviewsCount: 0,
      source: "user",
      departures: { create: dates.map((start) => ({ start, taken: 0 })) },
    },
    include: tourInclude,
  });
  return ok({ tour: toTour(tour) }, 201);
}
