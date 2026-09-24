import { fail, ok } from "@/lib/server/http";
import { currentUser, toPublicUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  const user = await currentUser();
  if (!user || user.role !== "admin") return fail("error.forbidden", 403);
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });
  return ok({ users: users.map((item) => toPublicUser(item, true)) });
}
