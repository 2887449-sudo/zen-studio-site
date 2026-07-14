"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminImageField } from "@/components/AdminImageField";
import { AdminVideoField } from "@/components/AdminVideoField";
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
  status: "published",
  sortOrder: 0
};

type AdminEpisodeFormProps = {
  id?: string;
};

function autoEnglishTitle(value: string) {
  return value
    .replace(/第\s*(\d+)\s*话/g, "Episode $1")
    .replace(/第\s*(\d+)\s*集/g, "Episode $1")
    .trim();
}

export function AdminEpisodeForm({ id }: AdminEpisodeFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [series, setSeries] = useState<ManagedSeries[]>([]);
  const [form, setForm] = useState<ManagedEpisode>(emptyEpisode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveInfo, setSaveInfo] = useState<{ thumbnailUrl: boolean } | null>(null);
  const autoTitleRef = useRef(true);
  const autoDescriptionRef = useRef(true);

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

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      titleZh: value,
      titleEn: autoTitleRef.current ? autoEnglishTitle(value) : current.titleEn
    }));
  }

  function handleDescriptionChange(value: string) {
    setForm((current) => ({
      ...current,
      descriptionZh: value,
      descriptionEn: autoDescriptionRef.current ? value : current.descriptionEn
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaveInfo(null);
    const payload = {
      ...form,
      titleEn: form.titleEn || form.titleZh,
      descriptionEn: form.descriptionEn || form.descriptionZh
    };
    if (!payload.seriesId || !payload.titleZh) {
      setError("请选择作品并填写剧集标题。");
      return;
    }
    if (!payload.previewVideoUrl && !payload.fullVideoUrl) {
      setError("请至少上传一个视频：试看视频或完整视频。");
      return;
    }
    setSaving(true);
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/admin/episodes/${id}` : "/api/admin/episodes";
      const result = await adminFetch<ApiItemResponse<ManagedEpisode>>(url, {
        method,
        body: JSON.stringify(payload)
      });
      if (result.mode === "supabase" && result.item) {
        upsertManagedEpisode(result.item);
        setForm(result.item);
        setSaveInfo({ thumbnailUrl: Boolean(result.item.thumbnailUrl) });
        console.info("[ZEN CMS] 已保存到 Supabase", {
          thumbnail_url: result.item.thumbnailUrl || ""
        });
      } else if (result.mode === "local") {
        upsertManagedEpisode(payload);
      }
      showToast(result.mode === "local" ? "已保存到本地模式，数据不会同步线上。" : "已保存到 Supabase");
      if (!id) router.push("/admin/episodes");
    } catch (saveError) {
      const message = saveError instanceof Error ? saveError.message : "保存失败";
      showToast(`保存失败：${message}`);
      setError(message);
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
      <label>剧集标题<input value={form.titleZh} onChange={(event) => handleTitleChange(event.target.value)} placeholder="例如：第1话 小汐的新故事" required /></label>
      <label>英文标题（自动生成，可不填）<input value={form.titleEn || ""} onChange={(event) => { autoTitleRef.current = false; update("titleEn", event.target.value); }} /></label>
      <label>第几话<input type="number" min="1" value={form.episodeNumber} onChange={(event) => update("episodeNumber", Number(event.target.value))} /></label>
      <label>剧集简介<textarea value={form.descriptionZh || ""} onChange={(event) => handleDescriptionChange(event.target.value)} /></label>
      <label>英文简介（自动跟随中文，可不填）<textarea value={form.descriptionEn || ""} onChange={(event) => { autoDescriptionRef.current = false; update("descriptionEn", event.target.value); }} /></label>
      <AdminImageField label="缩略图（播放列表显示）" value={form.thumbnailUrl || ""} uploadType="episode-thumbnail" onChange={(value) => update("thumbnailUrl", value)} />
      <AdminVideoField label="上传试看视频（可选，给 preview 使用）" value={form.previewVideoUrl || ""} onChange={(value) => update("previewVideoUrl", value)} />
      <AdminVideoField label="上传完整视频（推荐上传这里）" value={form.fullVideoUrl || ""} onChange={(value) => update("fullVideoUrl", value)} />
      <label>观看权限<select value={form.accessType} onChange={(event) => update("accessType", event.target.value as ManagedEpisode["accessType"])}>
        <option value="free">免费：完整观看</option>
        <option value="preview">试看：试看 60 秒</option>
        <option value="vip">VIP：会员专享</option>
      </select></label>
      <label>时长<input value={form.duration || ""} onChange={(event) => update("duration", event.target.value)} placeholder="08:42" /></label>
      <label>发布日期<input type="date" value={form.releaseDate || ""} onChange={(event) => update("releaseDate", event.target.value)} /></label>
      <label>排序<input type="number" value={form.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} /><small>数字越小越靠前。</small></label>
      <label>发布状态<select value={form.status} onChange={(event) => update("status", event.target.value as ManagedEpisode["status"])}>
        <option value="draft">草稿：后台可见，前台不显示</option>
        <option value="published">已发布：前台显示</option>
        <option value="archived">已归档：下架保留</option>
      </select></label>
      {error ? <p className="admin-form-error">{error}</p> : null}
      {saveInfo ? (
        <div className="admin-save-info">
          <strong>已保存到 Supabase</strong>
          <span>thumbnail_url: {saveInfo.thumbnailUrl ? "有值" : "无值"}</span>
        </div>
      ) : null}
      <div className="admin-form-actions">
        <button type="submit" className="btn primary" disabled={saving}>{saving ? "保存中..." : "保存剧集"}</button>
        <Link href="/admin/episodes" className="btn dark-outline">返回列表</Link>
      </div>
    </form>
  );
}
