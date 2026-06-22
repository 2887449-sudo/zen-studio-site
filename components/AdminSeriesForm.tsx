"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createLocalId,
  getManagedSeries,
  upsertManagedSeries,
  type ManagedSeries
} from "@/lib/content-storage";

const emptySeries: ManagedSeries = {
  id: "",
  titleZh: "",
  titleEn: "",
  slug: "",
  descriptionZh: "",
  descriptionEn: "",
  categoryZh: "",
  categoryEn: "",
  coverUrl: "",
  heroImageUrl: "",
  badge: "HOT",
  isVip: false,
  status: "draft",
  episodeCount: 1,
  isFeatured: false
};

type AdminSeriesFormProps = {
  id?: string;
};

export function AdminSeriesForm({ id }: AdminSeriesFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ManagedSeries>(emptySeries);

  useEffect(() => {
    if (!id) {
      setForm({ ...emptySeries, id: createLocalId("series") });
      return;
    }
    const item = getManagedSeries().find((series) => series.id === id);
    if (item) setForm(item);
  }, [id]);

  function update<K extends keyof ManagedSeries>(key: K, value: ManagedSeries[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    upsertManagedSeries(form);
    router.push("/admin/series");
  }

  return (
    <form className="admin-edit-form" onSubmit={handleSubmit}>
      <label>中文标题<input value={form.titleZh} onChange={(event) => update("titleZh", event.target.value)} required /></label>
      <label>英文标题<input value={form.titleEn} onChange={(event) => update("titleEn", event.target.value)} required /></label>
      <label>Slug<input value={form.slug} onChange={(event) => update("slug", event.target.value)} placeholder="xiaoxi-campus-diary" required /></label>
      <label>中文简介<textarea value={form.descriptionZh} onChange={(event) => update("descriptionZh", event.target.value)} /></label>
      <label>英文简介<textarea value={form.descriptionEn} onChange={(event) => update("descriptionEn", event.target.value)} /></label>
      <label>中文分类<input value={form.categoryZh} onChange={(event) => update("categoryZh", event.target.value)} placeholder="校园、搞笑、日常" /></label>
      <label>英文分类<input value={form.categoryEn} onChange={(event) => update("categoryEn", event.target.value)} placeholder="School, Comedy, Slice of Life" /></label>
      <label>封面地址<input value={form.coverUrl} onChange={(event) => update("coverUrl", event.target.value)} placeholder="/images/covers/xiaoxi.svg" /></label>
      <label>Hero 图片地址<input value={form.heroImageUrl} onChange={(event) => update("heroImageUrl", event.target.value)} placeholder="/images/hero/hero-xiaoxi.jpg" /></label>
      <label>徽标<input value={form.badge} onChange={(event) => update("badge", event.target.value)} placeholder="HOT / VIP / 独家" /></label>
      <label>剧集数<input type="number" min="0" value={form.episodeCount} onChange={(event) => update("episodeCount", Number(event.target.value))} /></label>
      <label>状态<select value={form.status} onChange={(event) => update("status", event.target.value as ManagedSeries["status"])}>
        <option value="draft">draft</option>
        <option value="published">published</option>
      </select></label>
      <label className="admin-check"><input type="checkbox" checked={form.isVip} onChange={(event) => update("isVip", event.target.checked)} /> VIP 作品</label>
      <label className="admin-check"><input type="checkbox" checked={form.isFeatured} onChange={(event) => update("isFeatured", event.target.checked)} /> 首页精选</label>
      <button type="submit" className="btn primary">保存作品</button>
    </form>
  );
}
