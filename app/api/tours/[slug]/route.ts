import { fail, ok } from "@/lib/server/http";
import { currentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { readJson } from "@/lib/server/parse";
import { toTour, tourInclude } from "@/lib/server/tours";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const tour = await prisma.tour.findFirst({
    where: { slug, deletedAt: null },
    include: tourInclude,
  });
  if (!tour) return fail("error.tourMissing", 404);
  return ok({ tour: toTour(tour) });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const user = await currentUser();
  const { slug } = await ctx.params;
  const tour = await prisma.tour.findFirst({ where: { slug, deletedAt: null }, include: tourInclude });
  if (!user || !tour) return fail("error.forbidden", 403);
  const can = user.role === "admin" || (user.role === "organizer" && user.id === tour.organizerId);
  if (!can) return fail("error.forbidden", 403);

  const body = await readJson(request);
  if (!body || typeof body !== "object") return fail("error.badFields", 400);
  const input = body as Record<string, unknown>;
  const data: {
    title?: string;
    subtitle?: string;
    city?: string;
    country?: string;
    meetingPoint?: string;
    price?: number;
    seats?: number;
    cover?: string;
    gallery?: string[];
    cancellation?: string;
  } = {};

  if (input.title !== undefined) {
    if (typeof input.title !== "string" || !input.title.trim()) return fail("error.badFields", 400);
    data.title = input.title.trim();
  }
  if (input.subtitle !== undefined) data.subtitle = typeof input.subtitle === "string" ? input.subtitle.trim() : "";
  if (input.city !== undefined) data.city = typeof input.city === "string" && input.city.trim() ? input.city.trim() : tour.city;
  if (input.country !== undefined) data.country = typeof input.country === "string" && input.country.trim() ? input.country.trim() : tour.country;
  if (input.meetingPoint !== undefined) data.meetingPoint = typeof input.meetingPoint === "string" ? input.meetingPoint.trim() : "";
  if (input.cancellation !== undefined) data.cancellation = typeof input.cancellation === "string" ? input.cancellation.trim() : "";
  if (input.cover !== undefined) {
    if (typeof input.cover !== "string" || !input.cover.trim()) return fail("error.badFields", 400);
    data.cover = input.cover.trim();
  }
  if (input.gallery !== undefined) {
    if (!Array.isArray(input.gallery) || input.gallery.some((item) => typeof item !== "string")) return fail("error.badFields", 400);
    data.gallery = input.gallery;
  }
  if (input.price !== undefined) {
    const price = Number(input.price);
    if (!Number.isFinite(price) || price < 1) return fail("error.badFields", 400);
    data.price = Math.round(price);
  }
  if (input.seats !== undefined) {
    const seats = Math.round(Number(input.seats));
    const taken = Math.max(...tour.departures.map((item) => item.taken), 0);
    if (seats < 1 || seats < taken) return fail("error.seatsLow", 400);
    data.seats = seats;
  }

  const updated = await prisma.tour.update({ where: { slug }, data, include: tourInclude });
  return ok({ tour: toTour(updated) });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const user = await currentUser();
  const { slug } = await ctx.params;
  const tour = await prisma.tour.findFirst({ where: { slug, deletedAt: null } });
  if (!user || !tour) return fail("error.forbidden", 403);
  const can = user.role === "admin" || (user.role === "organizer" && user.id === tour.organizerId);
  if (!can) return fail("error.forbidden", 403);
  await prisma.tour.update({ where: { slug }, data: { deletedAt: new Date() } });
  return ok();
}
