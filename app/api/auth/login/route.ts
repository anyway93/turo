import { fail, ok } from "@/lib/server/http";
import { checkPassword, openSession, toPublicUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { readJson } from "@/lib/server/parse";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body || typeof body !== "object") return fail("error.badFields", 400);
  const input = body as Record<string, unknown>;
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  if (!email || !password) return fail("error.badCredentials", 401);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await checkPassword(password, user.passwordHash))) {
    return fail("error.badCredentials", 401);
  }
  await openSession(user.id);
  return ok({ user: toPublicUser(user, true) });
}
