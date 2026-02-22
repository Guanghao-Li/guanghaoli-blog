export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getBlogById } from "@/models/Blog";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await getBlogById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load blog" }, { status: 500 });
  }
}
