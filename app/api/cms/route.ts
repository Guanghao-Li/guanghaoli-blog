export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { loadCmsData } from "@/lib/cms-db";

export async function GET() {
  try {
    const data = await loadCmsData();
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
