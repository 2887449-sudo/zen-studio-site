"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";

const SESSION_KEY = "zen_admin_authed";

type AdminAuthGateProps = {
  children: ReactNode;
};

export function AdminAuthGate({ children }: AdminAuthGateProps) {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthed(window.sessionStorage.getItem(SESSION_KEY) === "true");
    setReady(true);
  }, []);

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
          <Link href="/admin">统计总览</Link>
          <Link href="/admin/series">作品管理</Link>
          <Link href="/admin/episodes">剧集管理</Link>
        </nav>
        {children}
      </section>
    </main>
  );
}
