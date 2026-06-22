"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { getManagedEpisodes, getManagedSeries, saveManagedEpisodes, type ManagedEpisode, type ManagedSeries } from "@/lib/content-storage";

export default function AdminEpisodesPage() {
  const [items, setItems] = useState<ManagedEpisode[]>([]);
  const [series, setSeries] = useState<ManagedSeries[]>([]);

  useEffect(() => {
    setItems(getManagedEpisodes());
    setSeries(getManagedSeries());
  }, []);

  function seriesName(seriesId: string) {
    const item = series.find((entry) => entry.id === seriesId);
    return item?.titleZh || item?.titleEn || seriesId;
  }

  function remove(id: string) {
    const next = items.filter((item) => item.id !== id);
    saveManagedEpisodes(next);
    setItems(next);
  }

  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">EPISODES</p>
          <h1>剧集管理</h1>
          <p>先填写视频地址，不做真实上传。支持本地 /videos/... 或外部视频 URL。</p>
        </div>
        <Link href="/admin/episodes/new" className="btn primary">新增剧集</Link>
      </div>
      <section className="admin-panel">
        <table>
          <thead><tr><th>作品</th><th>剧集</th><th>标题</th><th>访问</th><th>状态</th><th>操作</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{seriesName(item.seriesId)}</td>
                <td>第 {item.episodeNumber} 话</td>
                <td>{item.titleZh || item.titleEn}</td>
                <td>{item.accessType}</td>
                <td>{item.status}</td>
                <td className="admin-table-actions">
                  <Link href={`/admin/episodes/${item.id}/edit`}>编辑</Link>
                  <button type="button" onClick={() => remove(item.id)}>删除</button>
                </td>
              </tr>
            ))}
            {!items.length ? <tr><td colSpan={6}>暂无后台剧集。请先新增作品，再新增剧集。</td></tr> : null}
          </tbody>
        </table>
      </section>
    </AdminAuthGate>
  );
}
