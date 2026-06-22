"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { getManagedSeries, saveManagedSeries, type ManagedSeries } from "@/lib/content-storage";

export default function AdminSeriesPage() {
  const [items, setItems] = useState<ManagedSeries[]>([]);

  function refresh() {
    setItems(getManagedSeries());
  }

  useEffect(() => {
    refresh();
  }, []);

  function remove(id: string) {
    const next = items.filter((item) => item.id !== id);
    saveManagedSeries(next);
    setItems(next);
  }

  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">CONTENT</p>
          <h1>作品管理</h1>
          <p>先用 localStorage 管理作品。发布状态为 published 时，前台会优先读取这里的数据。</p>
        </div>
        <Link href="/admin/series/new" className="btn primary">新增作品</Link>
      </div>
      <section className="admin-panel">
        <table>
          <thead><tr><th>作品名</th><th>Slug</th><th>状态</th><th>VIP</th><th>剧集数</th><th>操作</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.titleZh || item.titleEn}</td>
                <td>{item.slug}</td>
                <td>{item.status}</td>
                <td>{item.isVip ? "是" : "否"}</td>
                <td>{item.episodeCount}</td>
                <td className="admin-table-actions">
                  <Link href={`/admin/series/${item.id}/edit`}>编辑</Link>
                  <button type="button" onClick={() => remove(item.id)}>删除</button>
                </td>
              </tr>
            ))}
            {!items.length ? <tr><td colSpan={6}>暂无后台作品。点击“新增作品”开始。</td></tr> : null}
          </tbody>
        </table>
      </section>
    </AdminAuthGate>
  );
}
