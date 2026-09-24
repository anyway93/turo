import { createHash, randomBytes } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { prisma } from "./prisma";

const COOKIE = "turo_session";
const MAX_AGE = 60 * 60 * 24 * 30;

export type PublicUser = {
  id: string;
  email?: string;
  name: string;
  role: string;
  avatar: string;
  city: string;
  country: string;
  bio: string;
  languages: string[];
  rating: number;
  reviewsCount: number;
  yearsGuiding?: number;
};

export function toPublicUser(user: User, revealEmail: boolean): PublicUser {
  return {
    id: user.id,
    ...(revealEmail ? { email: user.email } : {}),
    name: user.name,
    role: user.role,
    avatar: user.avatar,
    city: user.city,
    country: user.country,
    bio: user.bio,
    languages: user.languages,
    rating: user.rating,
    reviewsCount: user.reviewsCount,
    ...(user.yearsGuiding != null ? { yearsGuiding: user.yearsGuiding } : {}),
  };
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function checkPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function openSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + MAX_AGE * 1000);
  await prisma.session.create({
    data: { tokenHash: hashToken(token), userId, expiresAt },
  });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
  }
  jar.set(COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function currentUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  });
  if (!session || session.expiresAt.getTime() <= Date.now()) {
    if (session) await prisma.session.delete({ where: { id: session.id } });
    return null;
  }
  return session.user;
}
