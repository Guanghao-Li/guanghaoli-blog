export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { clearTelemetry } from "@/models/Telemetry";

/**
 * POST /api/admin/iot/clear
 * Body: { apiKey?: string } - 若省略则清空全部
 * 需 admin 鉴权（可后续加 session 校验）
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { apiKey } = body;

    await clearTelemetry(apiKey);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Clear failed" }, { status: 500 });
  }
}
