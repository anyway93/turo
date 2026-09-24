import { fail, ok } from "@/lib/server/http";
import { currentUser, toPublicUser } from "@/lib/server/auth";
import { prisma } from "@/lib/server/prisma";
import { isRole, readJson } from "@/lib/server/parse";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return fail("error.forbidden", 404);
  const user = await currentUser();
  const reveal = Boolean(user && (user.role === "admin" || user.id === target.id));
  return ok({ user: toPublicUser(target, reveal) });
}

export async function PATCH(request: Request, ctx: Ctx) {
  const user = await currentUser();
  if (!user || user.role !== "admin") return fail("error.forbidden", 403);
  const { id } = await ctx.params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return fail("error.forbidden", 404);

  const body = await readJson(request);
  if (!body || typeof body !== "object") return fail("error.badFields", 400);
  const input = body as Record<string, unknown>;
  const data: { name?: string; city?: string; bio?: string; role?: string } = {};

  if (input.name !== undefined) {
    if (typeof input.name !== "string" || !input.name.trim()) return fail("error.badFields", 400);
    data.name = input.name.trim();
  }
  if (input.city !== undefined) data.city = typeof input.city === "string" && input.city.trim() ? input.city.trim() : "—";
  if (input.bio !== undefined) data.bio = typeof input.bio === "string" ? input.bio.trim() : "";
  if (input.role !== undefined) {
    if (typeof input.role !== "string" || !isRole(input.role)) return fail("error.forbidden", 403);
    if (id === user.id && input.role !== user.role) return fail("error.ownRole", 403);
    if (target.role === "admin" && input.role !== "admin") {
      const admins = await prisma.user.count({ where: { role: "admin" } });
      if (admins <= 1) return fail("error.lastAdmin", 403);
    }
    data.role = input.role;
  }

  const updated = await prisma.user.update({ where: { id }, data });
  return ok({ user: toPublicUser(updated, true) });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const user = await currentUser();
  if (!user || user.role !== "admin") return fail("error.forbidden", 403);
  const { id } = await ctx.params;
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return fail("error.forbidden", 404);
  if (id === user.id) return fail("error.ownDelete", 403);
  if (target.role === "admin") {
    const admins = await prisma.user.count({ where: { role: "admin" } });
    if (admins <= 1) return fail("error.lastAdmin", 403);
  }
  const tours = await prisma.tour.count({ where: { organizerId: id, deletedAt: null } });
  if (tours > 0) return fail("error.userHasTours", 409);
  const bookings = await prisma.booking.count({ where: { userId: id, status: { not: "cancelled" } } });
  if (bookings > 0) return fail("error.userHasBookings", 409);

  try {
    await prisma.user.delete({ where: { id } });
  } catch {
    return fail("error.userHasBookings", 409);
  }
  return ok();
}
