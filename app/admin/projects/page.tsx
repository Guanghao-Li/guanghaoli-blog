import ProjectsManager from "@/components/admin/ProjectsManager";

export default function AdminProjectsPage() {
  return (
    <div>
      <h1 className="text-xl font-bold md:text-2xl">项目展示</h1>
      <p className="mt-2 text-sm text-zinc-500 md:text-base">项目 CRUD 与 Markdown 编辑</p>
      <ProjectsManager />
    </div>
  );
}
