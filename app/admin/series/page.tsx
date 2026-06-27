"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { adminFetch } from "@/lib/admin-api";
import {
  getManagedSeries,
  saveManagedSeries,
  type ManagedSeries
} from "@/lib/content-storage";
import type { ApiListResponse } from "@/lib/cms-types";

export default function AdminSeriesPage() {
  const [items, setItems] = useState<ManagedSeries[]>([]);
  const [mode, setMode] = useState<"supabase" | "local">("local");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");

  async function refresh() {
    const localItems = getManagedSeries();
    setItems(localItems);
    try {
      const result = await adminFetch<ApiListResponse<ManagedSeries>>("/api/admin/series");
      setMode(result.mode);
      if (result.items.length || result.mode === "supabase") setItems(result.items);
    } catch {
      setMode("local");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  const categories = useMemo(() => Array.from(new Set(items.flatMap((item) => item.categoryZh))), [items]);
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = !query || `${item.titleZh}${item.titleEn || ""}${item.slug}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || item.status === status;
      const matchesCategory = category === "all" || item.categoryZh.includes(category);
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [category, items, query, status]);

  async function persist(item: ManagedSeries) {
    if (mode === "supabase") {
      await adminFetch(`/api/admin/series/${item.id}`, { method: "PUT", body: JSON.stringify(item) });
      await refresh();
      return;
    }
    saveManagedSeries(items.map((entry) => entry.id === item.id ? item : entry));
    setItems((current) => current.map((entry) => entry.id === item.id ? item : entry));
  }

  async function remove(item: ManagedSeries) {
    if (!window.confirm(`确认删除作品「${item.titleZh}」？`)) return;
    if (mode === "supabase") {
      await adminFetch(`/api/admin/series/${item.id}`, { method: "DELETE" });
      await refresh();
      return;
    }
    const next = items.filter((entry) => entry.id !== item.id);
    saveManagedSeries(next);
    setItems(next);
  }

  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">CONTENT</p>
          <h1>作品管理</h1>
          <p>{mode === "local" ? "当前为本地/模拟数据模式，数据不会同步线上。" : "当前已连接 Supabase。"}</p>
        </div>
        <Link href="/admin/series/new" className="btn primary">上传作品</Link>
      </div>
      <section className="admin-panel">
        <div className="admin-filter-bar">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索作品名或 slug" />
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">全部状态</option>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">全部分类</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <table>
          <thead><tr><th>封面</th><th>作品名</th><th>Slug</th><th>分类</th><th>集数</th><th>VIP</th><th>推荐</th><th>状态</th><th>排序</th><th>操作</th></tr></thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>{item.coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="admin-thumb" src={item.coverUrl} alt="" />
                ) : "-"}</td>
                <td>{item.titleZh || item.titleEn}</td>
                <td>{item.slug}</td>
                <td>{item.categoryZh.join(" / ")}</td>
                <td>{item.episodeCount}</td>
                <td>{item.isVip ? "是" : "否"}</td>
                <td><button type="button" onClick={() => persist({ ...item, isFeatured: !item.isFeatured })}>{item.isFeatured ? "已推荐" : "未推荐"}</button></td>
                <td><button type="button" onClick={() => persist({ ...item, status: item.status === "published" ? "draft" : "published" })}>{item.status}</button></td>
                <td><input className="admin-sort-input" type="number" value={item.sortOrder} onChange={(event) => persist({ ...item, sortOrder: Number(event.target.value) })} /></td>
                <td className="admin-table-actions">
                  <Link href={`/admin/series/${item.id}/edit`}>编辑</Link>
                  <button type="button" onClick={() => remove(item)}>删除</button>
                </td>
              </tr>
            ))}
            {!filtered.length ? <tr><td colSpan={10}>暂无作品。</td></tr> : null}
          </tbody>
        </table>
      </section>
    </AdminAuthGate>
  );
}
