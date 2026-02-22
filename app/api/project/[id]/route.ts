export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getProjectById } from "@/models/Project";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load project" }, { status: 500 });
  }
}
