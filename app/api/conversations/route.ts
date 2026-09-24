import { fail, ok } from "@/lib/server/http";
import { currentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { readJson, uid } from "@/lib/server/parse";

function toConversation(item: { id: string; tourSlug: string; travelerId: string; organizerId: string }) {
  return {
    id: item.id,
    tourSlug: item.tourSlug,
    travelerId: item.travelerId,
    organizerId: item.organizerId,
  };
}

export async function GET() {
  const user = await currentUser();
  if (!user) return fail("error.login", 401);
  const where =
    user.role === "admin" ? {} : { OR: [{ travelerId: user.id }, { organizerId: user.id }] };
  const conversations = await prisma.conversation.findMany({ where, orderBy: { createdAt: "desc" } });
  return ok({ conversations: conversations.map(toConversation) });
}

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return fail("error.login", 401);
  const body = await readJson(request);
  const tourSlug = body && typeof body === "object" ? (body as { tourSlug?: unknown }).tourSlug : "";
  if (typeof tourSlug !== "string" || !tourSlug) return fail("error.badFields", 400);

  const tour = await prisma.tour.findFirst({ where: { slug: tourSlug, deletedAt: null } });
  if (!tour) return fail("error.tourMissing", 404);
  if (user.id === tour.organizerId) return fail("error.chatFromList", 403);

  const paid = await prisma.booking.findFirst({
    where: { userId: user.id, tourSlug, status: { not: "cancelled" } },
  });
  if (!paid) return fail("error.chatAfterPay", 403);

  const existing = await prisma.conversation.findUnique({
    where: {
      tourSlug_travelerId_organizerId: {
        tourSlug,
        travelerId: user.id,
        organizerId: tour.organizerId,
      },
    },
  });
  if (existing) return ok({ conversation: toConversation(existing) });

  const created = await prisma.conversation.create({
    data: {
      id: uid("conv"),
      tourSlug,
      travelerId: user.id,
      organizerId: tour.organizerId,
    },
  });
  return ok({ conversation: toConversation(created) }, 201);
}
