import ProjectsManager from "@/components/admin/ProjectsManager";

export default function AdminProjectsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">项目管理</h1>
      <p className="mt-2 text-zinc-500">CRUD 与 Markdown 编辑</p>
      <ProjectsManager />
    </div>
  );
}
