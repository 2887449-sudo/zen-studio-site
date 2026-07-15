"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { useToast } from "@/components/ToastProvider";
import { adminFetch } from "@/lib/admin-api";
import type { ApiListResponse, CmsEpisode, CmsSeries } from "@/lib/cms-types";

type StorageItem = {
  bucket: string;
  name: string;
  path: string;
  publicUrl: string;
  createdAt: string;
  size: number;
  mimeType: string;
};

type StorageResponse = {
  mode: "supabase" | "local";
  buckets: Record<string, StorageItem[]>;
};

const bucketLabels: Record<string, string> = {
  "series-covers": "作品封面",
  "series-heroes": "作品详情 Hero 图",
  "episode-thumbnails": "剧集缩略图",
  "hero-slides": "首页 Hero 图",
  "episode-videos": "剧集视频"
};

function formatSize(size: number) {
  if (!size) return "未知大小";
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.ceil(size / 1024)} KB`;
}

export default function AdminMediaPage() {
  const { showToast } = useToast();
  const [buckets, setBuckets] = useState<Record<string, StorageItem[]>>({});
  const [series, setSeries] = useState<CmsSeries[]>([]);
  const [episodes, setEpisodes] = useState<CmsEpisode[]>([]);
  const [seriesId, setSeriesId] = useState("");
  const [episodeId, setEpisodeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [storageResult, seriesResult, episodeResult] = await Promise.all([
        adminFetch<StorageResponse>("/api/admin/storage"),
        adminFetch<ApiListResponse<CmsSeries>>("/api/admin/series"),
        adminFetch<ApiListResponse<CmsEpisode>>("/api/admin/episodes")
      ]);
      setBuckets(storageResult.buckets);
      setSeries(seriesResult.items);
      setEpisodes(episodeResult.items);
      setSeriesId((current) => current || seriesResult.items[0]?.id || "");
      setEpisodeId((current) => current || episodeResult.items[0]?.id || "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "读取 Storage 失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  const episodeOptions = useMemo(() => episodes.map((episode) => {
    const owner = series.find((item) => item.id === episode.seriesId);
    return { ...episode, label: `${owner?.titleZh || "未找到作品"} · 第 ${episode.episodeNumber} 集 · ${episode.titleZh}` };
  }), [episodes, series]);

  async function bindSeriesImage(item: StorageItem, field: "coverUrl" | "heroImageUrl") {
    const target = series.find((entry) => entry.id === seriesId);
    if (!target) return showToast("请先选择作品。");
    try {
      const result = await adminFetch<{ item: CmsSeries }>(`/api/admin/series/${target.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...target, [field]: item.publicUrl })
      });
      setSeries((current) => current.map((entry) => entry.id === target.id ? result.item : entry));
      showToast(field === "coverUrl" ? "已绑定到 series.cover_url" : "已绑定到 series.hero_image_url");
    } catch (bindError) {
      showToast(bindError instanceof Error ? bindError.message : "绑定失败");
    }
  }

  async function bindEpisodeImage(item: StorageItem) {
    const target = episodes.find((entry) => entry.id === episodeId);
    if (!target) return showToast("请先选择剧集。");
    try {
      const result = await adminFetch<{ item: CmsEpisode }>(`/api/admin/episodes/${target.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...target, thumbnailUrl: item.publicUrl })
      });
      setEpisodes((current) => current.map((entry) => entry.id === target.id ? result.item : entry));
      showToast("已绑定到 episodes.thumbnail_url");
    } catch (bindError) {
      showToast(bindError instanceof Error ? bindError.message : "绑定失败");
    }
  }

  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">MEDIA LIBRARY</p>
          <h1>已有素材绑定</h1>
          <p>直接选择 Supabase Storage 中已有的图片绑定到作品或剧集，不需要重新上传。</p>
        </div>
        <button type="button" className="btn dark-outline" onClick={() => void load()}>刷新素材</button>
      </div>

      <section className="admin-panel admin-media-targets">
        <label>绑定到作品
          <select value={seriesId} onChange={(event) => setSeriesId(event.target.value)}>
            <option value="">请选择作品</option>
            {series.map((item) => <option key={item.id} value={item.id}>{item.titleZh} · {item.slug}</option>)}
          </select>
        </label>
        <label>绑定到剧集
          <select value={episodeId} onChange={(event) => setEpisodeId(event.target.value)}>
            <option value="">请选择剧集</option>
            {episodeOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
      </section>

      {error ? <p className="admin-form-error">{error}</p> : null}
      {loading ? <section className="admin-panel">正在读取 Supabase Storage...</section> : null}

      {!loading ? Object.entries(bucketLabels).map(([bucket, label]) => {
        const items = buckets[bucket] || [];
        return (
          <section className="admin-panel admin-media-section" key={bucket}>
            <div className="admin-media-heading">
              <div><h2>{label}</h2><p>{bucket} · {items.length} 个文件</p></div>
            </div>
            {items.length ? (
              <div className="admin-media-grid">
                {items.map((item) => (
                  <article className="admin-media-item" key={`${bucket}-${item.path}`}>
                    {item.mimeType.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.publicUrl} alt="" />
                    ) : <div className="admin-media-file">VIDEO</div>}
                    <strong title={item.path}>{item.name}</strong>
                    <span>{formatSize(item.size)}</span>
                    <div className="admin-media-actions">
                      {bucket === "series-covers" ? <button type="button" onClick={() => void bindSeriesImage(item, "coverUrl")}>设为作品封面</button> : null}
                      {bucket === "series-heroes" ? <button type="button" onClick={() => void bindSeriesImage(item, "heroImageUrl")}>设为详情 Hero</button> : null}
                      {bucket === "episode-thumbnails" ? <button type="button" onClick={() => void bindEpisodeImage(item)}>设为剧集缩略图</button> : null}
                      <a href={item.publicUrl} target="_blank" rel="noreferrer">查看原文件</a>
                    </div>
                  </article>
                ))}
              </div>
            ) : <p className="admin-note">这个 bucket 目前没有文件。</p>}
          </section>
        );
      }) : null}
    </AdminAuthGate>
  );
}
