import { ok } from "@/lib/server/http";
import { clearSession } from "@/lib/server/auth";

export async function POST() {
  await clearSession();
  return ok();
}
