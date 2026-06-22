"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createLocalId,
  getManagedEpisodes,
  getManagedSeries,
  upsertManagedEpisode,
  type ManagedEpisode
} from "@/lib/content-storage";

const emptyEpisode: ManagedEpisode = {
  id: "",
  seriesId: "",
  titleZh: "",
  titleEn: "",
  episodeNumber: 1,
  thumbnailUrl: "",
  previewVideoUrl: "",
  fullVideoUrl: "",
  accessType: "free",
  duration: "",
  releaseDate: "",
  status: "draft"
};

type AdminEpisodeFormProps = {
  id?: string;
};

export function AdminEpisodeForm({ id }: AdminEpisodeFormProps) {
  const router = useRouter();
  const [series, setSeries] = useState(getManagedSeries());
  const [form, setForm] = useState<ManagedEpisode>(emptyEpisode);

  useEffect(() => {
    const currentSeries = getManagedSeries();
    setSeries(currentSeries);
    if (!id) {
      setForm({ ...emptyEpisode, id: createLocalId("episode"), seriesId: currentSeries[0]?.id ?? "" });
      return;
    }
    const item = getManagedEpisodes().find((episode) => episode.id === id);
    if (item) setForm(item);
  }, [id]);

  function update<K extends keyof ManagedEpisode>(key: K, value: ManagedEpisode[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    upsertManagedEpisode(form);
    router.push("/admin/episodes");
  }

  return (
    <form className="admin-edit-form" onSubmit={handleSubmit}>
      <label>所属作品<select value={form.seriesId} onChange={(event) => update("seriesId", event.target.value)} required>
        <option value="">请选择作品</option>
        {series.map((item) => <option key={item.id} value={item.id}>{item.titleZh || item.titleEn}</option>)}
      </select></label>
      <label>中文标题<input value={form.titleZh} onChange={(event) => update("titleZh", event.target.value)} required /></label>
      <label>英文标题<input value={form.titleEn} onChange={(event) => update("titleEn", event.target.value)} required /></label>
      <label>集数<input type="number" min="1" value={form.episodeNumber} onChange={(event) => update("episodeNumber", Number(event.target.value))} /></label>
      <label>缩略图地址<input value={form.thumbnailUrl} onChange={(event) => update("thumbnailUrl", event.target.value)} placeholder="/images/episodes/xiaoxi-ep01.svg" /></label>
      <label>试看视频地址<input value={form.previewVideoUrl} onChange={(event) => update("previewVideoUrl", event.target.value)} placeholder="/videos/xiaoxi-ep01-preview.mp4" /></label>
      <label>完整视频地址<input value={form.fullVideoUrl} onChange={(event) => update("fullVideoUrl", event.target.value)} placeholder="https://视频平台地址/xxx.mp4" /></label>
      <label>访问类型<select value={form.accessType} onChange={(event) => update("accessType", event.target.value as ManagedEpisode["accessType"])}>
        <option value="free">free</option>
        <option value="preview">preview</option>
        <option value="vip">vip</option>
      </select></label>
      <label>时长<input value={form.duration} onChange={(event) => update("duration", event.target.value)} placeholder="08:42" /></label>
      <label>发布日期<input type="date" value={form.releaseDate} onChange={(event) => update("releaseDate", event.target.value)} /></label>
      <label>状态<select value={form.status} onChange={(event) => update("status", event.target.value as ManagedEpisode["status"])}>
        <option value="draft">draft</option>
        <option value="published">published</option>
      </select></label>
      <button type="submit" className="btn primary">保存剧集</button>
    </form>
  );
}
