import ResumeManager from "@/components/admin/ResumeManager";

export default function AdminResumePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">简历管理</h1>
      <p className="mt-2 text-zinc-500">联系方式与经历</p>
      <ResumeManager />
    </div>
  );
}
