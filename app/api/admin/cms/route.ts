import { NextResponse } from "next/server";
import { loadCmsData, saveCmsData, type CmsData } from "@/lib/data-store";

export async function GET() {
  try {
    const data = await loadCmsData();
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data: CmsData = await request.json();
    await saveCmsData(data);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
