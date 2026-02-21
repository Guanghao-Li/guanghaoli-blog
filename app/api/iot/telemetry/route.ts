export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getTelemetry } from "@/models/Telemetry";

/**
 * GET /api/iot/telemetry?apiKey=xxx&metricKey=xxx&limit=200&since=ISO8601
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const apiKey = searchParams.get("apiKey");
    const metricKey = searchParams.get("metricKey") ?? undefined;
    const limit = Math.min(500, Math.max(1, parseInt(searchParams.get("limit") ?? "200", 10) || 200));
    const sinceParam = searchParams.get("since");

    if (!apiKey) {
      return NextResponse.json(
        { error: "apiKey query param required" },
        { status: 400 }
      );
    }

    const since = sinceParam ? new Date(sinceParam) : undefined;
    const docs = await getTelemetry(apiKey, { metricKey, limit, since });

    return NextResponse.json(
      docs.map((d: any) => ({
        timestamp: d.timestamp,
        value: d.value,
        metricKey: d.metricKey,
        label: d.label,
      }))
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
