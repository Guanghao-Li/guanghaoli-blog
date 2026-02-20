"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      let errorMsg = "";
      try {
        const data = await res.json();
        errorMsg = typeof data?.error === "string" ? data.error : "";
      } catch {
        errorMsg = `Request failed: ${res.status} ${res.statusText}`;
      }
      if (!res.ok) {
        const msg = errorMsg || `请求失败 (${res.status})`;
        setError(msg === "Invalid password" || msg === "Unauthorized" ? "密码错误，请重试" : msg);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-700 dark:bg-zinc-800"
      >
        <h1 className="text-xl font-semibold">后台管理登录</h1>
        <p className="mt-1 text-sm text-zinc-500">请输入管理员密码</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="管理员密码"
          className="mt-4 w-full rounded-lg border border-zinc-300 bg-transparent px-4 py-3 dark:border-zinc-600"
          autoFocus
          disabled={loading}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-zinc-900 py-3 font-medium text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "登录中..." : "登录"}
        </button>
      </form>
    </div>
  );
}
