"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { adminFetch } from "@/lib/admin-api";
import { getManagedEpisodes, getManagedSeries, saveManagedEpisodes, type ManagedEpisode, type ManagedSeries } from "@/lib/content-storage";
import type { ApiListResponse } from "@/lib/cms-types";

export default function AdminEpisodesPage() {
  const [items, setItems] = useState<ManagedEpisode[]>([]);
  const [series, setSeries] = useState<ManagedSeries[]>([]);
  const [mode, setMode] = useState<"supabase" | "local">("local");
  const [seriesId, setSeriesId] = useState("all");
  const [status, setStatus] = useState("all");
  const [accessType, setAccessType] = useState("all");

  async function refresh() {
    setItems(getManagedEpisodes());
    setSeries(getManagedSeries());
    try {
      const [episodeResult, seriesResult] = await Promise.all([
        adminFetch<ApiListResponse<ManagedEpisode>>("/api/admin/episodes"),
        adminFetch<ApiListResponse<ManagedSeries>>("/api/admin/series")
      ]);
      setMode(episodeResult.mode);
      if (episodeResult.items.length || episodeResult.mode === "supabase") setItems(episodeResult.items);
      if (seriesResult.items.length || seriesResult.mode === "supabase") setSeries(seriesResult.items);
    } catch {
      setMode("local");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const filtered = useMemo(() => items.filter((item) => {
    return (seriesId === "all" || item.seriesId === seriesId) &&
      (status === "all" || item.status === status) &&
      (accessType === "all" || item.accessType === accessType);
  }), [accessType, items, seriesId, status]);

  function seriesName(id: string) {
    const item = series.find((entry) => entry.id === id);
    return item?.titleZh || item?.titleEn || id;
  }

  async function persist(item: ManagedEpisode) {
    if (mode === "supabase") {
      await adminFetch(`/api/admin/episodes/${item.id}`, { method: "PUT", body: JSON.stringify(item) });
      await refresh();
      return;
    }
    saveManagedEpisodes(items.map((entry) => entry.id === item.id ? item : entry));
    setItems((current) => current.map((entry) => entry.id === item.id ? item : entry));
  }

  async function remove(item: ManagedEpisode) {
    if (!window.confirm(`确认删除剧集「${item.titleZh}」？`)) return;
    if (mode === "supabase") {
      await adminFetch(`/api/admin/episodes/${item.id}`, { method: "DELETE" });
      await refresh();
      return;
    }
    const next = items.filter((entry) => entry.id !== item.id);
    saveManagedEpisodes(next);
    setItems(next);
  }

  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">EPISODES</p>
          <h1>剧集管理</h1>
          <p>{mode === "local" ? "当前为本地/模拟数据模式，数据不会同步线上。" : "当前已连接 Supabase。"}</p>
        </div>
        <Link href="/admin/episodes/new" className="btn primary">新增剧集</Link>
      </div>
      <section className="admin-panel">
        <div className="admin-filter-bar">
          <select value={seriesId} onChange={(event) => setSeriesId(event.target.value)}>
            <option value="all">全部作品</option>
            {series.map((item) => <option key={item.id} value={item.id}>{item.titleZh || item.titleEn}</option>)}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">全部状态</option>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
          <select value={accessType} onChange={(event) => setAccessType(event.target.value)}>
            <option value="all">全部权限</option>
            <option value="free">free</option>
            <option value="preview">preview</option>
            <option value="vip">vip</option>
          </select>
        </div>
        <table>
          <thead><tr><th>缩略图</th><th>所属作品</th><th>第几话</th><th>标题</th><th>权限</th><th>时长</th><th>状态</th><th>发布日期</th><th>操作</th></tr></thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="admin-thumb" src={item.thumbnailUrl} alt="" />
                ) : "-"}</td>
                <td>{seriesName(item.seriesId)}</td>
                <td>第 {item.episodeNumber} 话</td>
                <td>{item.titleZh || item.titleEn}</td>
                <td>{item.accessType}</td>
                <td>{item.duration || "-"}</td>
                <td><button type="button" onClick={() => persist({ ...item, status: item.status === "published" ? "draft" : "published" })}>{item.status}</button></td>
                <td>{item.releaseDate || "-"}</td>
                <td className="admin-table-actions">
                  <Link href={`/admin/episodes/${item.id}/edit`}>编辑</Link>
                  <button type="button" onClick={() => remove(item)}>删除</button>
                </td>
              </tr>
            ))}
            {!filtered.length ? <tr><td colSpan={9}>暂无剧集。</td></tr> : null}
          </tbody>
        </table>
      </section>
    </AdminAuthGate>
  );
}
