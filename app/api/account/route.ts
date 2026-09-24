import { fail, ok } from "@/lib/server/http";
import { currentUser, toPublicUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { asStringList, readJson } from "@/lib/server/parse";

export async function PATCH(request: Request) {
  const user = await currentUser();
  if (!user) return fail("error.login", 401);
  const body = await readJson(request);
  if (!body || typeof body !== "object") return fail("error.badFields", 400);
  const input = body as Record<string, unknown>;
  const data: {
    name?: string;
    city?: string;
    country?: string;
    bio?: string;
    avatar?: string;
    languages?: string[];
  } = {};

  if (input.name !== undefined) {
    if (typeof input.name !== "string" || !input.name.trim()) return fail("error.badFields", 400);
    data.name = input.name.trim();
  }
  if (input.city !== undefined) {
    data.city = typeof input.city === "string" && input.city.trim() ? input.city.trim() : "—";
  }
  if (input.country !== undefined) {
    data.country = typeof input.country === "string" && input.country.trim() ? input.country.trim() : "—";
  }
  if (input.bio !== undefined) {
    data.bio = typeof input.bio === "string" ? input.bio.trim() : "";
  }
  if (input.avatar !== undefined) {
    if (typeof input.avatar !== "string") return fail("error.badFields", 400);
    data.avatar = input.avatar.trim();
  }
  if (input.languages !== undefined) {
    const languages = asStringList(input.languages);
    if (!languages) return fail("error.badFields", 400);
    data.languages = languages;
  }

  const updated = await prisma.user.update({ where: { id: user.id }, data });
  return ok({ user: toPublicUser(updated, true) });
}
