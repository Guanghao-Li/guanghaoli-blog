import IotSettings from "@/components/admin/IotSettings";

export default function AdminIotPage() {
  return (
    <div>
      <h1 className="text-xl font-bold md:text-2xl">IoT 配置</h1>
      <p className="mt-2 text-sm text-zinc-500 md:text-base">仪表盘区块文案与遥测配置</p>
      <IotSettings />
    </div>
  );
}
