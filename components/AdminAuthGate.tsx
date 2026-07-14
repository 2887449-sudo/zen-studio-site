"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import { ADMIN_PASSWORD_STORAGE_KEY } from "@/lib/content-storage";
import { adminFetch } from "@/lib/admin-api";

const SESSION_KEY = "zen_admin_authed";

type AdminAuthGateProps = {
  children: ReactNode;
};

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [modeMessage, setModeMessage] = useState("正在检查保存模式...");

  useEffect(() => {
    const hasSession = window.sessionStorage.getItem(SESSION_KEY) === "true";
    const hasPassword = Boolean(window.sessionStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY));
    setAuthed(hasSession && hasPassword);
    if (hasSession && !hasPassword) window.sessionStorage.removeItem(SESSION_KEY);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    void adminFetch<{
      hasSupabaseUrl: boolean;
      hasAnonKey: boolean;
      hasServiceRoleKey: boolean;
    }>("/api/admin/health")
      .then((health) => {
        const cloudReady = health.hasSupabaseUrl && health.hasAnonKey && health.hasServiceRoleKey;
        const localMode = !health.hasSupabaseUrl && !health.hasAnonKey && !health.hasServiceRoleKey;
        if (cloudReady) setModeMessage("Supabase 云端模式");
        else if (localMode) setModeMessage("本地模拟模式");
        else {
          const missing = [
            !health.hasSupabaseUrl ? "Supabase URL" : "",
            !health.hasAnonKey ? "Anon Key" : "",
            !health.hasServiceRoleKey ? "Service Role Key" : ""
          ].filter(Boolean).join("、");
          setModeMessage(`Supabase 配置不完整：缺少 ${missing}`);
        }
      })
      .catch((healthError) => setModeMessage(healthError instanceof Error ? healthError.message : "无法检查保存模式"));
  }, [authed]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await response.json() as { ok?: boolean };
    if (data.ok) {
      window.sessionStorage.setItem(SESSION_KEY, "true");
      window.sessionStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, password);
      window.sessionStorage.removeItem("zen_admin_token");
      setAuthed(true);
      return;
    }
    setError("密码不正确");
  }

  if (!ready) return null;

  if (!authed) {
    return (
      <main className="admin-page admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <span className="admin-lock"><LockKeyhole size={22} /></span>
          <p className="eyebrow">ZEN ADMIN</p>
          <h1>后台入口</h1>
          <p>请输入后台密码。本地未设置 ADMIN_PASSWORD 时，默认密码为 zen-admin-2026。</p>
          <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Admin password" />
          <button type="submit" className="btn primary">进入后台</button>
          {error ? <p className="admin-error">{error}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <nav className="admin-nav">
          <Link href="/admin/quick-upload">快捷上传</Link>
          <Link href="/admin">数据总览</Link>
          <Link href="/admin/series">作品管理</Link>
          <Link href="/admin/episodes">剧集管理</Link>
          <Link href="/admin/hero">Hero 管理</Link>
          <Link href="/admin/media">素材管理</Link>
          <Link href="/admin/settings">网站设置</Link>
        </nav>
        <div className="admin-mode-banner">当前模式：{modeMessage}</div>
        {children}
      </section>
    </main>
  );
}
