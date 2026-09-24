import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomBytes } from "crypto";
import { fail, ok } from "@/lib/server/http";
import { currentUser } from "@/lib/server/auth";

const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) return fail("error.login", 401);

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return fail("error.badFields", 400);
  const ext = TYPES[file.type];
  if (!ext) return fail("error.fileType", 400);
  if (file.size < 1 || file.size > MAX) return fail("error.fileSize", 400);

  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return ok({ url: `/uploads/${name}` }, 201);
}
