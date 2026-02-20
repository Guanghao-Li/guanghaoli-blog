import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin-auth";

export async function POST(request: Request) {
  // 调试：无条件最先打印，确认请求已到达 API
  let password = "";
  try {
    const body = await request.json();
    password = body?.password ?? "";
  } catch {}
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  console.log("[admin/login] 前端传来的 password:", JSON.stringify(password));
  console.log("[admin/login] process.env.ADMIN_PASSWORD:", adminPassword ? "已设置" : "未设置");

  try {
    if (!adminPassword) {
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "密码错误，请重试" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE, password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
