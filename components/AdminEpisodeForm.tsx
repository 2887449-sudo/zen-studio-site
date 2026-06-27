"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminImageField } from "@/components/AdminImageField";
import { useToast } from "@/components/ToastProvider";
import { adminFetch } from "@/lib/admin-api";
import {
  createLocalId,
  getManagedEpisodes,
  getManagedSeries,
  upsertManagedEpisode,
  type ManagedEpisode,
  type ManagedSeries
} from "@/lib/content-storage";
import type { ApiItemResponse, ApiListResponse } from "@/lib/cms-types";

const emptyEpisode: ManagedEpisode = {
  id: "",
  seriesId: "",
  titleZh: "",
  titleEn: "",
  episodeNumber: 1,
  descriptionZh: "",
  descriptionEn: "",
  thumbnailUrl: "",
  previewVideoUrl: "",
  fullVideoUrl: "",
  accessType: "free",
  duration: "",
  releaseDate: "",
  status: "draft",
  sortOrder: 0
};

type AdminEpisodeFormProps = {
  id?: string;
};

export function AdminEpisodeForm({ id }: AdminEpisodeFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [series, setSeries] = useState<ManagedSeries[]>([]);
  const [form, setForm] = useState<ManagedEpisode>(emptyEpisode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      let currentSeries = getManagedSeries();
      try {
        const result = await adminFetch<ApiListResponse<ManagedSeries>>("/api/admin/series");
        if (result.items.length) currentSeries = result.items;
      } catch {
        // Keep local fallback.
      }
      setSeries(currentSeries);

      if (!id) {
        setForm({ ...emptyEpisode, id: createLocalId("episode"), seriesId: currentSeries[0]?.id ?? "" });
        return;
      }

      const localItem = getManagedEpisodes().find((episode) => episode.id === id);
      if (localItem) setForm(localItem);
      try {
        const result = await adminFetch<ApiItemResponse<ManagedEpisode>>(`/api/admin/episodes/${id}`);
        if (result.item) setForm(result.item);
      } catch {
        // Local fallback is already loaded.
      }
    }
    void load();
  }, [id]);

  function update<K extends keyof ManagedEpisode>(key: K, value: ManagedEpisode[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!form.seriesId || !form.titleZh) {
      setError("请选择作品并填写中文标题。");
      return;
    }
    setSaving(true);
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/admin/episodes/${id}` : "/api/admin/episodes";
      const result = await adminFetch<ApiItemResponse<ManagedEpisode>>(url, {
        method,
        body: JSON.stringify(form)
      });
      if (result.item) {
        upsertManagedEpisode(result.item);
        setForm(result.item);
      } else {
        upsertManagedEpisode(form);
      }
      showToast(result.mode === "local" ? "已保存到本地模式，数据不会同步线上。" : "剧集已保存。");
      if (!id) router.push("/admin/episodes");
    } catch (saveError) {
      upsertManagedEpisode(form);
      showToast("Supabase 未配置或保存失败，已保存到本地模式。");
      setError(saveError instanceof Error ? saveError.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-edit-form" onSubmit={handleSubmit}>
      <label>所属作品<select value={form.seriesId} onChange={(event) => update("seriesId", event.target.value)} required>
        <option value="">请选择作品</option>
        {series.map((item) => <option key={item.id} value={item.id}>{item.titleZh || item.titleEn}</option>)}
      </select></label>
      <label>中文标题<input value={form.titleZh} onChange={(event) => update("titleZh", event.target.value)} required /></label>
      <label>英文标题<input value={form.titleEn || ""} onChange={(event) => update("titleEn", event.target.value)} /></label>
      <label>集数<input type="number" min="1" value={form.episodeNumber} onChange={(event) => update("episodeNumber", Number(event.target.value))} /></label>
      <label>中文简介<textarea value={form.descriptionZh || ""} onChange={(event) => update("descriptionZh", event.target.value)} /></label>
      <label>英文简介<textarea value={form.descriptionEn || ""} onChange={(event) => update("descriptionEn", event.target.value)} /></label>
      <AdminImageField label="缩略图" value={form.thumbnailUrl || ""} bucket="episode-thumbnails" onChange={(value) => update("thumbnailUrl", value)} />
      <label>试看视频地址<input value={form.previewVideoUrl || ""} onChange={(event) => update("previewVideoUrl", event.target.value)} placeholder="/videos/xiaoxi-ep01-preview.mp4" /></label>
      <label>完整视频地址<input value={form.fullVideoUrl || ""} onChange={(event) => update("fullVideoUrl", event.target.value)} placeholder="https://video.example.com/xxx.mp4" /></label>
      <label>访问类型<select value={form.accessType} onChange={(event) => update("accessType", event.target.value as ManagedEpisode["accessType"])}>
        <option value="free">free - 免费完整观看</option>
        <option value="preview">preview - 试看 60 秒</option>
        <option value="vip">vip - 会员专享</option>
      </select></label>
      <label>时长<input value={form.duration || ""} onChange={(event) => update("duration", event.target.value)} placeholder="08:42" /></label>
      <label>发布日期<input type="date" value={form.releaseDate || ""} onChange={(event) => update("releaseDate", event.target.value)} /></label>
      <label>排序<input type="number" value={form.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} /></label>
      <label>状态<select value={form.status} onChange={(event) => update("status", event.target.value as ManagedEpisode["status"])}>
        <option value="draft">draft</option>
        <option value="published">published</option>
        <option value="archived">archived</option>
      </select></label>
      {error ? <p className="admin-form-error">{error}</p> : null}
      <div className="admin-form-actions">
        <button type="submit" className="btn primary" disabled={saving}>{saving ? "保存中..." : "保存剧集"}</button>
        <Link href="/admin/episodes" className="btn dark-outline">返回列表</Link>
      </div>
    </form>
  );
}
