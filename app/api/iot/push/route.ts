export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { pushTelemetry } from "@/models/Telemetry";

/**
 * POST /api/iot/push
 * Body: { apiKey: string, value: number, metricKey?: string, label?: string }
 * 用于 MCU/设备通过 HTTP 推送遥测数据
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey, value, metricKey, label } = body;

    if (!apiKey || typeof value !== "number") {
      return NextResponse.json(
        { error: "apiKey and value (number) required" },
        { status: 400 }
      );
    }

    await pushTelemetry({
      apiKey: String(apiKey),
      metricKey: metricKey ? String(metricKey) : undefined,
      value: Number(value),
      label: label ? String(label) : undefined,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Push failed" }, { status: 500 });
  }
}
