import ResumeManager from "@/components/admin/ResumeManager";

export default function AdminResumePage() {
  return (
    <div>
      <h1 className="text-xl font-bold md:text-2xl">简历管理</h1>
      <p className="mt-2 text-sm text-zinc-500 md:text-base">联系方式与经历</p>
      <ResumeManager />
    </div>
  );
}
