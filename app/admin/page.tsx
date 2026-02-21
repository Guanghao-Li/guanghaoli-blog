import HeroSettings from "@/components/admin/HeroSettings";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-xl font-bold md:text-2xl">极客仪表盘</h1>
      <p className="mt-2 text-sm text-zinc-500 md:text-base">Hero 区块与站点基础信息</p>
      <HeroSettings />
    </div>
  );
}
