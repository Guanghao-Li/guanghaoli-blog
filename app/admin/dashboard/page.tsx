import DashboardManager from "@/components/admin/DashboardManager";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard Widget 管理</h1>
      <p className="mt-2 text-zinc-500">
        添加、配置和排序首页 Lab 区块的 Widget
      </p>
      <DashboardManager />
    </div>
  );
}
