import { ok } from "@/lib/server/http";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  const [destinations, grouped] = await Promise.all([
    prisma.destination.findMany({ orderBy: { name: "asc" } }),
    prisma.tour.groupBy({
      by: ["destinationSlug"],
      where: { deletedAt: null },
      _count: { _all: true },
    }),
  ]);
  const counts = new Map(grouped.map((item) => [item.destinationSlug, item._count._all]));
  return ok({
    destinations: destinations.map((item) => ({
      slug: item.slug,
      name: item.name,
      country: item.country,
      continent: item.continent,
      image: item.image,
      blurb: item.blurb,
      toursCount: counts.get(item.slug) ?? 0,
    })),
  });
}
