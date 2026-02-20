import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_DATA, migrateResume, migrateProjects } from "@/lib/data-store";
import { saveCmsData } from "@/lib/cms-db";

const DATA_PATH = path.join(process.cwd(), "data", "cms.json");

/**
 * 一次性迁移：从本地 data/cms.json 导入到 MongoDB。
 * GET /api/admin/migrate 触发。部署到只读文件系统前在本地执行一次即可。
 */
export async function GET() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);

    const resume = migrateResume(parsed);
    const projects =
      Array.isArray(parsed.projects) && parsed.projects.length > 0
        ? migrateProjects(parsed.projects)
        : DEFAULT_DATA.projects;

    const data = {
      hero: parsed.hero ?? DEFAULT_DATA.hero,
      resume,
      projects,
      iot: parsed.iot ?? DEFAULT_DATA.iot,
    };

    await saveCmsData(data);
    return NextResponse.json({
      success: true,
      message: "数据迁移成功！",
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        error: e instanceof Error ? e.message : "Migration failed",
      },
      { status: 500 }
    );
  }
}
