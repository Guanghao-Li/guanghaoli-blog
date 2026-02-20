import IotSettings from "@/components/admin/IotSettings";

export default function AdminIotPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">仪表盘配置 (IoT)</h1>
      <p className="mt-2 text-zinc-500">Dashboard 区块文案与占位配置</p>
      <IotSettings />
    </div>
  );
}
