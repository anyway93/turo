import { ok } from "@/lib/server/http";
import { currentUser, toPublicUser } from "@/lib/server/auth";

export async function GET() {
  const user = await currentUser();
  return ok({ user: user ? toPublicUser(user, true) : null });
}
