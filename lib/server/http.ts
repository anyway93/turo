import { NextResponse } from "next/server";

export function ok(data: Record<string, unknown> = {}, status = 200) {
  return NextResponse.json({ ok: true, ...data }, { status });
}

export function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}
