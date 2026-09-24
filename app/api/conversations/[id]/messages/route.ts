import { fail, ok } from "@/lib/server/http";
import { currentUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { readJson, uid } from "@/lib/server/parse";

type Ctx = { params: Promise<{ id: string }> };

function toMessage(item: { id: string; conversationId: string; senderId: string; text: string; createdAt: Date }) {
  return {
    id: item.id,
    conversationId: item.conversationId,
    senderId: item.senderId,
    text: item.text,
    createdAt: item.createdAt.toISOString(),
  };
}

async function participant(id: string, userId: string, role: string) {
  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation) return null;
  const allowed = role === "admin" || conversation.travelerId === userId || conversation.organizerId === userId;
  return allowed ? conversation : null;
}

export async function GET(_request: Request, ctx: Ctx) {
  const user = await currentUser();
  if (!user) return fail("error.login", 401);
  const { id } = await ctx.params;
  const conversation = await participant(id, user.id, user.role);
  if (!conversation) return fail("error.forbidden", 403);
  const messages = await prisma.chatMessage.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
  });
  return ok({ messages: messages.map(toMessage) });
}

export async function POST(request: Request, ctx: Ctx) {
  const user = await currentUser();
  if (!user) return fail("error.login", 401);
  const { id } = await ctx.params;
  const conversation = await prisma.conversation.findUnique({ where: { id } });
  if (!conversation || (conversation.travelerId !== user.id && conversation.organizerId !== user.id)) {
    return fail("error.forbidden", 403);
  }

  const body = await readJson(request);
  const text = body && typeof body === "object" && typeof (body as { text?: unknown }).text === "string"
    ? (body as { text: string }).text.trim()
    : "";
  if (!text) return fail("error.badFields", 400);

  const message = await prisma.chatMessage.create({
    data: {
      id: uid("msg"),
      conversationId: id,
      senderId: user.id,
      text,
      createdAt: new Date(),
    },
  });
  return ok({ message: toMessage(message) }, 201);
}
