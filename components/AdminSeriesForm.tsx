"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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
  status: "published",
  episodeCount: 1,
  views: 0,
  followers: 0,
  sortOrder: 0
};

type AdminSeriesFormProps = {
  id?: string;
};

const categoryMap: Record<string, string> = {
  校园: "School",
  搞笑: "Comedy",
  日常: "Slice of Life",
  悬疑: "Mystery",
  科幻: "Sci-Fi",
  都市: "Urban",
  少女: "Girlhood",
  热血: "Action",
  冒险: "Adventure",
  成长: "Coming-of-age",
  仙侠: "Xianxia",
  奇幻: "Fantasy",
  未来: "Future"
};

function slugify(value: string) {
  const known: Record<string, string> = {
    小汐的日记: "xiaoxi-diary",
    小汐的校园显眼包日记: "xiaoxi-campus-diary"
  };
  if (known[value.trim()]) return known[value.trim()];
  return value
    .trim()
    .toLowerCase()
    .replace(/小汐/g, "xiaoxi")
    .replace(/校园/g, "campus")
    .replace(/日记/g, "diary")
    .replace(/故事/g, "story")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || `series-${Date.now()}`;
}

function autoEnglishTitle(value: string) {
  const known: Record<string, string> = {
    小汐的日记: "Xiaoxi's Diary",
    小汐的校园显眼包日记: "Xiaoxi's Campus Spotlight Diary"
  };
  return known[value.trim()] || value.trim();
}

function categoriesToText(value: string[]) {
  return value.join("、");
}

function textToCategories(value: string) {
  return value.split(/[、,\/]/).map((item) => item.trim()).filter(Boolean);
}

function autoEnglishCategories(value: string) {
  return textToCategories(value).map((item) => categoryMap[item] || item).join(", ");
}

export function AdminSeriesForm({ id }: AdminSeriesFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [form, setForm] = useState<ManagedSeries>(emptySeries);
  const [categoryZh, setCategoryZh] = useState("");
  const [categoryEn, setCategoryEn] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveInfo, setSaveInfo] = useState<{ coverUrl: boolean; heroImageUrl: boolean } | null>(null);
  const autoTitleRef = useRef(true);
  const autoDescriptionRef = useRef(true);
  const autoCategoryRef = useRef(true);

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
      titleEn: autoTitleRef.current ? autoEnglishTitle(value) : current.titleEn,
      slug: current.slug && id ? current.slug : slugify(value)
    }));
  }

  function handleDescriptionChange(value: string) {
    setForm((current) => ({
      ...current,
      descriptionZh: value,
      descriptionEn: autoDescriptionRef.current ? value : current.descriptionEn
    }));
  }

  function handleCategoryChange(value: string) {
    setCategoryZh(value);
    if (autoCategoryRef.current) setCategoryEn(autoEnglishCategories(value));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaveInfo(null);
    const payload = {
      ...form,
      titleEn: form.titleEn || form.titleZh,
      descriptionEn: form.descriptionEn || form.descriptionZh,
      categoryZh: textToCategories(categoryZh),
      categoryEn: textToCategories(categoryEn || autoEnglishCategories(categoryZh))
    };
    if (!payload.titleZh || !payload.slug) {
      setError("请填写作品名称。系统会自动生成访问标识。");
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
      if (result.mode === "supabase" && result.item) {
        upsertManagedSeries(result.item);
        setForm(result.item);
        setSaveInfo({
          coverUrl: Boolean(result.item.coverUrl),
          heroImageUrl: Boolean(result.item.heroImageUrl)
        });
        console.info("[ZEN CMS] 已保存到 Supabase", {
          cover_url: result.item.coverUrl || "",
          hero_image_url: result.item.heroImageUrl || ""
        });
      } else if (result.mode === "local") {
        upsertManagedSeries(payload);
      }
      showToast(result.mode === "local" ? "已保存到本地模式，数据不会同步线上。" : "已保存到 Supabase");
      if (!id) router.push("/admin/series");
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
      <label>作品名称<input value={form.titleZh} onChange={(event) => handleTitleChange(event.target.value)} placeholder="例如：小汐的日记" required /></label>
      <label>英文名称（自动生成，可不填）<input value={form.titleEn || ""} onChange={(event) => { autoTitleRef.current = false; update("titleEn", event.target.value); }} /></label>
      <label>访问标识 Slug（自动生成）<input value={form.slug} onChange={(event) => update("slug", event.target.value)} required /><small>用于网址，例如 /series/xiaoxi-diary。</small></label>
      <label>作品简介<textarea value={form.descriptionZh || ""} onChange={(event) => handleDescriptionChange(event.target.value)} placeholder="用中文介绍这个故事" /></label>
      <label>英文简介（自动跟随中文，可不填）<textarea value={form.descriptionEn || ""} onChange={(event) => { autoDescriptionRef.current = false; update("descriptionEn", event.target.value); }} /></label>
      <label>分类<input value={categoryZh} onChange={(event) => handleCategoryChange(event.target.value)} placeholder="校园、搞笑、日常" /></label>
      <label>英文分类（自动识别，可不填）<input value={categoryEn} onChange={(event) => { autoCategoryRef.current = false; setCategoryEn(event.target.value); }} placeholder="School, Comedy, Slice of Life" /></label>
      <AdminImageField label="封面图（作品卡片显示）" value={form.coverUrl || ""} uploadType="series-cover" onChange={(value) => update("coverUrl", value)} />
      <AdminImageField label="Hero 图（详情页/推荐位大图）" value={form.heroImageUrl || ""} uploadType="series-hero" onChange={(value) => update("heroImageUrl", value)} />
      <label>角标<input value={form.badge || ""} onChange={(event) => update("badge", event.target.value)} placeholder="例如：HOT、独家、VIP、更新中" /><small>显示在封面上的小标签。</small></label>
      <label>剧集数量<input type="number" min="0" value={form.episodeCount} onChange={(event) => update("episodeCount", Number(event.target.value))} /></label>
      <label>排序<input type="number" value={form.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} /><small>数字越小越靠前。</small></label>
      <label>发布状态<select value={form.status} onChange={(event) => update("status", event.target.value as ManagedSeries["status"])}>
        <option value="draft">草稿：后台可见，前台不显示</option>
        <option value="published">已发布：前台显示</option>
        <option value="archived">已归档：下架保留</option>
      </select></label>
      <label className="admin-check"><input type="checkbox" checked={form.isFeatured} onChange={(event) => update("isFeatured", event.target.checked)} /> 首页推荐</label>
      <label className="admin-check"><input type="checkbox" checked={form.isVip} onChange={(event) => update("isVip", event.target.checked)} /> VIP 作品</label>
      {error ? <p className="admin-form-error">{error}</p> : null}
      {saveInfo ? (
        <div className="admin-save-info">
          <strong>已保存到 Supabase</strong>
          <span>cover_url: {saveInfo.coverUrl ? "有值" : "无值"}</span>
          <span>hero_image_url: {saveInfo.heroImageUrl ? "有值" : "无值"}</span>
        </div>
      ) : null}
      <div className="admin-form-actions">
        <button type="submit" className="btn primary" disabled={saving}>{saving ? "保存中..." : "保存作品"}</button>
        <Link href="/admin/series" className="btn dark-outline">返回列表</Link>
      </div>
    </form>
  );
}
