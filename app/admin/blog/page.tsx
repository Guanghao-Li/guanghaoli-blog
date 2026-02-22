import BlogManager from "@/components/admin/BlogManager";

export default function AdminBlogPage() {
  return (
    <div>
      <h1 className="text-xl font-bold md:text-2xl">博客管理</h1>
      <p className="mt-2 text-sm text-zinc-500 md:text-base">博客 CRUD 与内容编辑</p>
      <BlogManager />
    </div>
  );
}
