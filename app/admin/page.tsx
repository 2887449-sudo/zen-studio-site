"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BarChart3, Eye, MousePointerClick, Play, Sparkles } from "lucide-react";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { getStoredAnalyticsEvents, type AnalyticsEvent } from "@/lib/analytics-events";

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
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    setEvents(getStoredAnalyticsEvents());
  }, []);

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
      const name = payloadValue(event, "title") || payloadValue(event, "slug") || payloadValue(event, "seriesId");
      if (!name) return;
      const current = map.get(name) ?? { name, clicks: 0, plays: 0, vip: 0 };
      if (event.eventName === "series_card_click") current.clicks += 1;
      if (event.eventName === "episode_play_click") current.plays += 1;
      if (event.eventName === "vip_cta_click" || event.eventName === "membership_plan_click") current.vip += 1;
      map.set(name, current);
    });
    return Array.from(map.values()).filter((row) => row.clicks || row.plays || row.vip).slice(0, 12);
  }, [events]);

  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">ZEN ADMIN V0.2</p>
          <h1>后台统计与内容管理</h1>
          <p>当前使用 localStorage + console 记录事件；未来接入 Supabase 时可平滑迁移。</p>
        </div>
        <div className="admin-head-actions">
          <Link href="/admin/series/new" className="btn primary">新增作品</Link>
          <button type="button" className="btn dark-outline" onClick={() => setEvents(getStoredAnalyticsEvents())}>刷新数据</button>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div><Eye size={20} /><span>今日事件数</span><strong>{stats.totalToday}</strong></div>
        <div><Sparkles size={20} /><span>Hero 点击</span><strong>{stats.heroClicks}</strong></div>
        <div><MousePointerClick size={20} /><span>作品点击</span><strong>{stats.seriesClicks}</strong></div>
        <div><Play size={20} /><span>播放点击</span><strong>{stats.playClicks}</strong></div>
        <div><BarChart3 size={20} /><span>会员按钮点击</span><strong>{stats.vipClicks}</strong></div>
      </div>

      <div className="admin-grid-2">
        <section className="admin-panel">
          <h2>Hero 数据表</h2>
          <table>
            <thead><tr><th>Hero 名称</th><th>展示次数</th><th>点击次数</th><th>点击率</th></tr></thead>
            <tbody>
              {heroRows.map((row) => <tr key={row.name}><td>{row.name}</td><td>{row.views}</td><td>{row.clicks}</td><td>{row.rate}</td></tr>)}
            </tbody>
          </table>
        </section>
        <section className="admin-panel">
          <h2>作品数据表</h2>
          <table>
            <thead><tr><th>作品名</th><th>点击次数</th><th>播放点击</th><th>VIP 点击</th></tr></thead>
            <tbody>
              {seriesRows.length ? seriesRows.map((row) => <tr key={row.name}><td>{row.name}</td><td>{row.clicks}</td><td>{row.plays}</td><td>{row.vip}</td></tr>) : <tr><td colSpan={4}>暂无事件</td></tr>}
            </tbody>
          </table>
        </section>
      </div>

      <section className="admin-panel">
        <h2>最近事件列表</h2>
        <div className="admin-events">
          {events.slice(0, 30).map((event) => (
            <div key={event.id} className="admin-event-row">
              <span>{new Date(event.createdAt).toLocaleString()}</span>
              <strong>{event.eventName}</strong>
              <em>{event.path}</em>
              <b>{payloadSummary(event)}</b>
            </div>
          ))}
          {!events.length ? <div className="admin-empty">暂无本地事件。访问前台并点击 Hero、作品或播放按钮后，再回来刷新。</div> : null}
        </div>
      </section>
    </AdminAuthGate>
  );
}
