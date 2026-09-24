import { fail, ok } from "@/lib/server/http";
import { currentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { readJson, uid } from "@/lib/server/parse";

type Ctx = { params: Promise<{ slug: string }> };

function toReview(review: { id: string; tourSlug: string; userId: string; rating: number; title: string; text: string; date: string }) {
  return review;
}

export async function GET(_request: Request, ctx: Ctx) {
  const { slug } = await ctx.params;
  const tour = await prisma.tour.findFirst({ where: { slug, deletedAt: null } });
  if (!tour) return fail("error.tourMissing", 404);
  const reviews = await prisma.review.findMany({ where: { tourSlug: slug }, orderBy: { date: "desc" } });
  return ok({ reviews: reviews.map(toReview) });
}

export async function POST(request: Request, ctx: Ctx) {
  const user = await currentUser();
  if (!user) return fail("error.login", 401);
  if (user.role !== "traveler") return fail("error.forbidden", 403);
  const { slug } = await ctx.params;
  const tour = await prisma.tour.findFirst({ where: { slug, deletedAt: null } });
  if (!tour) return fail("error.tourMissing", 404);

  const finished = await prisma.booking.findFirst({
    where: { userId: user.id, tourSlug: slug, status: "completed" },
  });
  if (!finished) return fail("error.reviewAfterTrip", 403);

  const body = await readJson(request);
  if (!body || typeof body !== "object") return fail("error.badFields", 400);
  const input = body as Record<string, unknown>;
  const title = typeof input.title === "string" ? input.title.trim() : "";
  const text = typeof input.text === "string" ? input.text.trim() : "";
  const rating = Math.round(Number(input.rating));
  if (!title || !text || rating < 1 || rating > 5) return fail("error.badFields", 400);

  const exists = await prisma.review.findUnique({ where: { tourSlug_userId: { tourSlug: slug, userId: user.id } } });
  if (exists) return fail("error.reviewExists", 409);

  const review = await prisma.review.create({
    data: {
      id: uid("r"),
      tourSlug: slug,
      userId: user.id,
      rating,
      title,
      text,
      date: new Date().toISOString().slice(0, 10),
    },
  });

  const count = tour.reviewsCount + 1;
  const nextRating = (tour.rating * tour.reviewsCount + rating) / count;
  await prisma.tour.update({
    where: { slug },
    data: { reviewsCount: count, rating: Math.round(nextRating * 10) / 10 },
  });

  return ok({ review: toReview(review) }, 201);
}
