"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminImageField } from "@/components/AdminImageField";
import { useToast } from "@/components/ToastProvider";
import { adminFetch } from "@/lib/admin-api";
import {
  createLocalId,
  getManagedSeries,
  upsertManagedSeries,
  type ManagedSeries
} from "@/lib/content-storage";
import type { ApiItemResponse } from "@/lib/cms-types";

const emptySeries: ManagedSeries = {
  id: "",
  titleZh: "",
  titleEn: "",
  slug: "",
  descriptionZh: "",
  descriptionEn: "",
  categoryZh: [],
  categoryEn: [],
  coverUrl: "",
  heroImageUrl: "",
  badge: "HOT",
  isVip: false,
  isFeatured: false,
  status: "draft",
  episodeCount: 1,
  views: 0,
  followers: 0,
  sortOrder: 0
};

type AdminSeriesFormProps = {
  id?: string;
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categoriesToText(value: string[]) {
  return value.join("、");
}

function textToCategories(value: string) {
  return value.split(/[、,\/]/).map((item) => item.trim()).filter(Boolean);
}

export function AdminSeriesForm({ id }: AdminSeriesFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState<ManagedSeries>(emptySeries);
  const [categoryZh, setCategoryZh] = useState("");
  const [categoryEn, setCategoryEn] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      if (!id) {
        setForm({ ...emptySeries, id: createLocalId("series") });
        return;
      }
      const localItem = getManagedSeries().find((series) => series.id === id);
      if (localItem) {
        setForm(localItem);
        setCategoryZh(categoriesToText(localItem.categoryZh));
        setCategoryEn(categoriesToText(localItem.categoryEn));
      }
      try {
        const result = await adminFetch<ApiItemResponse<ManagedSeries>>(`/api/admin/series/${id}`);
        if (result.item) {
          setForm(result.item);
          setCategoryZh(categoriesToText(result.item.categoryZh));
          setCategoryEn(categoriesToText(result.item.categoryEn));
        }
      } catch {
        // Local fallback is already loaded.
      }
    }
    void load();
  }, [id]);

  function update<K extends keyof ManagedSeries>(key: K, value: ManagedSeries[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleTitleChange(value: string) {
    setForm((current) => ({
      ...current,
      titleZh: value,
      slug: current.slug ? current.slug : slugify(value)
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const payload = {
      ...form,
      categoryZh: textToCategories(categoryZh),
      categoryEn: textToCategories(categoryEn)
    };
    if (!payload.titleZh || !payload.slug) {
      setError("请填写中文标题和 slug。");
      return;
    }
    setSaving(true);
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `/api/admin/series/${id}` : "/api/admin/series";
      const result = await adminFetch<ApiItemResponse<ManagedSeries>>(url, {
        method,
        body: JSON.stringify(payload)
      });
      if (result.item) {
        upsertManagedSeries(result.item);
        setForm(result.item);
      } else {
        upsertManagedSeries(payload);
      }
      showToast(result.mode === "local" ? "已保存到本地模式，数据不会同步线上。" : "作品已保存。");
      if (!id) router.push("/admin/series");
    } catch (saveError) {
      upsertManagedSeries(payload);
      showToast("Supabase 未配置或保存失败，已保存到本地模式。");
      setError(saveError instanceof Error ? saveError.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="admin-edit-form" onSubmit={handleSubmit}>
      <label>中文标题<input value={form.titleZh} onChange={(event) => handleTitleChange(event.target.value)} required /></label>
      <label>英文标题<input value={form.titleEn || ""} onChange={(event) => update("titleEn", event.target.value)} /></label>
      <label>Slug<input value={form.slug} onChange={(event) => update("slug", event.target.value)} required /></label>
      <label>中文简介<textarea value={form.descriptionZh || ""} onChange={(event) => update("descriptionZh", event.target.value)} /></label>
      <label>英文简介<textarea value={form.descriptionEn || ""} onChange={(event) => update("descriptionEn", event.target.value)} /></label>
      <label>中文分类<input value={categoryZh} onChange={(event) => setCategoryZh(event.target.value)} placeholder="校园、搞笑、日常" /></label>
      <label>英文分类<input value={categoryEn} onChange={(event) => setCategoryEn(event.target.value)} placeholder="School, Comedy, Slice of Life" /></label>
      <AdminImageField label="封面图" value={form.coverUrl || ""} bucket="series-covers" onChange={(value) => update("coverUrl", value)} />
      <AdminImageField label="Hero 图" value={form.heroImageUrl || ""} bucket="series-heroes" onChange={(value) => update("heroImageUrl", value)} />
      <label>徽标<input value={form.badge || ""} onChange={(event) => update("badge", event.target.value)} placeholder="HOT / VIP / 独家" /></label>
      <label>剧集数<input type="number" min="0" value={form.episodeCount} onChange={(event) => update("episodeCount", Number(event.target.value))} /></label>
      <label>排序<input type="number" value={form.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} /></label>
      <label>状态<select value={form.status} onChange={(event) => update("status", event.target.value as ManagedSeries["status"])}>
        <option value="draft">draft</option>
        <option value="published">published</option>
        <option value="archived">archived</option>
      </select></label>
      <label className="admin-check"><input type="checkbox" checked={form.isVip} onChange={(event) => update("isVip", event.target.checked)} /> VIP 作品</label>
      <label className="admin-check"><input type="checkbox" checked={form.isFeatured} onChange={(event) => update("isFeatured", event.target.checked)} /> 首页推荐</label>
      {error ? <p className="admin-form-error">{error}</p> : null}
      <div className="admin-form-actions">
        <button type="submit" className="btn primary" disabled={saving}>{saving ? "保存中..." : "保存作品"}</button>
        <Link href="/admin/series" className="btn dark-outline">返回列表</Link>
      </div>
    </form>
  );
}
