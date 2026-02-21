import DashboardManager from "@/components/admin/DashboardManager";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-xl font-bold md:text-2xl">仪表盘组件</h1>
      <p className="mt-2 text-sm text-zinc-500 md:text-base">
        添加、配置和排序首页 Lab 区块的组件
      </p>
      <DashboardManager />
    </div>
  );
}
