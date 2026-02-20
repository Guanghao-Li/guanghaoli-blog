import HeroSettings from "@/components/admin/HeroSettings";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">基础设置</h1>
      <p className="mt-2 text-zinc-500">Hero 区块与站点基础信息</p>
      <HeroSettings />
    </div>
  );
}
