"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { BarChart3, Eye, LockKeyhole, MousePointerClick, Play, Sparkles } from "lucide-react";
import { getStoredAnalyticsEvents, type AnalyticsEvent } from "@/lib/analytics-events";

const SESSION_KEY = "zen_admin_authed";

const heroNames = [
  "小汐的校园显眼包日记",
  "仙境战士群像",
  "雨夜调查",
  "都市夜行者"
];

function payloadValue(event: AnalyticsEvent, key: string) {
  const value = event.payload?.[key];
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : "";
}

function payloadSummary(event: AnalyticsEvent) {
  if (!event.payload) return "-";
  return Object.entries(event.payload)
    .slice(0, 4)
    .map(([key, value]) => `${key}: ${String(value)}`)
    .join(" / ");
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    const saved = window.sessionStorage.getItem(SESSION_KEY) === "true";
    setAuthed(saved);
    if (saved) setEvents(getStoredAnalyticsEvents());
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
      setEvents(getStoredAnalyticsEvents());
      return;
    }
    setError("密码不正确");
  }

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const todayEvents = events.filter((event) => event.createdAt.startsWith(today));
    return {
      totalToday: todayEvents.length,
      heroClicks: events.filter((event) => event.eventName === "hero_click").length,
      seriesClicks: events.filter((event) => event.eventName === "series_card_click").length,
      playClicks: events.filter((event) => event.eventName === "episode_play_click").length,
      vipClicks: events.filter((event) => event.eventName === "vip_cta_click" || event.eventName === "membership_plan_click").length
    };
  }, [events]);

  const heroRows = useMemo(() => {
    return heroNames.map((name) => {
      const views = events.filter((event) => event.eventName === "hero_view" && payloadValue(event, "title") === name).length;
      const clicks = events.filter((event) => event.eventName === "hero_click" && payloadValue(event, "title") === name).length;
      const rate = views ? `${Math.round((clicks / views) * 100)}%` : "0%";
      return { name, views, clicks, rate };
    });
  }, [events]);

  const seriesRows = useMemo(() => {
    const map = new Map<string, { name: string; clicks: number; plays: number; vip: number }>();
    events.forEach((event) => {
      const name = payloadValue(event, "title") || payloadValue(event, "slug") || payloadValue(event, "seriesId") || "Unknown";
      const current = map.get(name) ?? { name, clicks: 0, plays: 0, vip: 0 };
      if (event.eventName === "series_card_click") current.clicks += 1;
      if (event.eventName === "episode_play_click") current.plays += 1;
      if (event.eventName === "vip_cta_click" || event.eventName === "membership_plan_click") current.vip += 1;
      map.set(name, current);
    });
    return Array.from(map.values()).filter((row) => row.clicks || row.plays || row.vip).slice(0, 12);
  }, [events]);

  if (!authed) {
    return (
      <main className="admin-page admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <span className="admin-lock"><LockKeyhole size={22} /></span>
          <p className="eyebrow">ZEN ADMIN</p>
          <h1>运营统计预览</h1>
          <p>输入后台密码查看本地事件统计。未配置环境变量时，默认密码为 zen-admin-2026。</p>
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
        <div className="admin-head">
          <div>
            <p className="eyebrow">ZEN ADMIN V0.2</p>
            <h1>后台统计与运营预览</h1>
            <p>当前展示 mock + localStorage 事件聚合，后续可接 Supabase analytics_events 表。</p>
          </div>
          <button type="button" className="btn dark-outline" onClick={() => setEvents(getStoredAnalyticsEvents())}>刷新数据</button>
        </div>

        <div className="admin-stat-grid">
          <div><Eye size={20} /><span>今日访问事件</span><strong>{stats.totalToday}</strong></div>
          <div><Sparkles size={20} /><span>Hero 点击</span><strong>{stats.heroClicks}</strong></div>
          <div><MousePointerClick size={20} /><span>作品点击</span><strong>{stats.seriesClicks}</strong></div>
          <div><Play size={20} /><span>播放点击</span><strong>{stats.playClicks}</strong></div>
          <div><BarChart3 size={20} /><span>会员按钮点击</span><strong>{stats.vipClicks}</strong></div>
        </div>

        <div className="admin-grid-2">
          <section className="admin-panel">
            <h2>Hero 数据</h2>
            <table>
              <thead><tr><th>Hero 名称</th><th>展示次数</th><th>点击次数</th><th>点击率</th></tr></thead>
              <tbody>
                {heroRows.map((row) => <tr key={row.name}><td>{row.name}</td><td>{row.views}</td><td>{row.clicks}</td><td>{row.rate}</td></tr>)}
              </tbody>
            </table>
          </section>
          <section className="admin-panel">
            <h2>作品数据</h2>
            <table>
              <thead><tr><th>作品名</th><th>点击</th><th>播放</th><th>VIP</th></tr></thead>
              <tbody>
                {seriesRows.length ? seriesRows.map((row) => <tr key={row.name}><td>{row.name}</td><td>{row.clicks}</td><td>{row.plays}</td><td>{row.vip}</td></tr>) : <tr><td colSpan={4}>暂无事件</td></tr>}
              </tbody>
            </table>
          </section>
        </div>

        <section className="admin-panel">
          <h2>最近事件</h2>
          <div className="admin-events">
            {events.slice(0, 30).map((event, index) => (
              <div key={`${event.createdAt}-${index}`} className="admin-event-row">
                <span>{new Date(event.createdAt).toLocaleString()}</span>
                <strong>{event.eventName}</strong>
                <em>{event.path}</em>
                <b>{payloadSummary(event)}</b>
              </div>
            ))}
            {!events.length ? <div className="admin-empty">暂无本地事件。访问首页、点击 Hero 或播放按钮后再回来刷新。</div> : null}
          </div>
        </section>
      </section>
    </main>
  );
}
