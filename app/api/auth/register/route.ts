import { fail, ok } from "@/lib/server/http";
import { hashPassword, openSession, toPublicUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { readJson, uid } from "@/lib/server/parse";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body || typeof body !== "object") return fail("error.badFields", 400);
  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const password = typeof input.password === "string" ? input.password : "";
  const city = typeof input.city === "string" ? input.city.trim() : "";
  const role = input.role === "organizer" ? "organizer" : input.role === "traveler" ? "traveler" : "";

  if (!name || !email.includes("@") || !role) return fail("error.badFields", 400);
  if (password.length < 6) return fail("error.shortPassword", 400);

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return fail("error.emailTaken", 409);

  const user = await prisma.user.create({
    data: {
      id: uid("usr"),
      email,
      passwordHash: await hashPassword(password),
      name,
      role,
      city: city || "—",
      country: "—",
      bio: "Новый профиль на Turo.",
      languages: ["Русский"],
      rating: role === "organizer" ? 5 : 0,
      reviewsCount: 0,
    },
  });

  await openSession(user.id);
  return ok({ user: toPublicUser(user, true) }, 201);
}
