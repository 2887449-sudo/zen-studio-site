"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { adminFetch } from "@/lib/admin-api";
import {
  createLocalId,
  getManagedEpisodes,
  getManagedSeries,
  upsertManagedEpisode,
  upsertManagedSeries,
  type ManagedEpisode,
  type ManagedSeries
} from "@/lib/content-storage";
import type { ApiItemResponse, ApiListResponse } from "@/lib/cms-types";

const NEW_SERIES = "__new_series__";
const CATEGORY_TAGS = ["校园", "搞笑", "日常", "家庭", "成长", "仙侠", "玄幻", "热血", "冒险", "都市", "悬疑", "科幻", "少女", "治愈"];

function slugify(value: string) {
  const text = value.trim().toLowerCase();
  const known = text
    .replace(/小汐/g, "xiaoxi")
    .replace(/日记/g, "diary")
    .replace(/故事/g, "story")
    .replace(/作品/g, "series");

  return known.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `series-${Date.now()}`;
}

function splitCategories(value: string) {
  return value.split(/[\/,，、]/).map((item) => item.trim()).filter(Boolean);
}

function joinCategories(items: string[]) {
  return Array.from(new Set(items)).join(" / ");
}

function suggestCategories(value: string) {
  const text = value.trim();
  if (!text) return "";
  if (/仙侠|修仙|仙境|剑|宗门|灵根|飞升/.test(text)) return "仙侠 / 玄幻 / 热血";
  if (/小汐|日记|校园|补习|同学|老师|作业|妈妈|爸爸/.test(text)) return "校园 / 搞笑 / 日常";
  if (/悬疑|调查|案件|真相|雨夜|谜/.test(text)) return "悬疑 / 都市";
  if (/科幻|星|宇宙|未来|协议|机甲/.test(text)) return "科幻 / 冒险";
  if (/都市|职场|夜行|城市/.test(text)) return "都市 / 日常";
  return "";
}

function getNextEpisodeNumber(seriesId: string, episodeItems: ManagedEpisode[]) {
  const episodes = episodeItems.filter((episode) => episode.seriesId === seriesId);
  if (!episodes.length) return 1;
  return Math.max(...episodes.map((episode) => Number(episode.episodeNumber) || 0)) + 1;
}

async function uploadImageFile(file: File) {
  const formData = new FormData();
  formData.set("type", "series-cover");
  formData.set("file", file);
  return adminFetch<{ publicUrl: string; message?: string }>("/api/admin/upload", {
    method: "POST",
    body: formData
  });
}

export default function QuickUploadPage() {
  const [seriesItems, setSeriesItems] = useState<ManagedSeries[]>(() => getManagedSeries());
  const [episodeItems, setEpisodeItems] = useState<ManagedEpisode[]>(() => getManagedEpisodes());
  const [mode, setMode] = useState<"supabase" | "local">("local");
  const [selectedSeriesId, setSelectedSeriesId] = useState(NEW_SERIES);
  const [title, setTitle] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [categoryTouched, setCategoryTouched] = useState(false);
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [seriesCoverUrl, setSeriesCoverUrl] = useState("");
  const [episodeCoverUrl, setEpisodeCoverUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [seriesCoverPreview, setSeriesCoverPreview] = useState("");
  const [episodeCoverPreview, setEpisodeCoverPreview] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedSeries = useMemo(
    () => seriesItems.find((series) => series.id === selectedSeriesId),
    [selectedSeriesId, seriesItems]
  );
  const selectedCategories = splitCategories(categoryInput);
  const nextEpisodeNumber = selectedSeries ? getNextEpisodeNumber(selectedSeries.id, episodeItems) : 1;
  const effectiveSeriesCoverUrl = seriesCoverUrl || selectedSeries?.coverUrl || "";
  const effectiveEpisodeCoverUrl = episodeCoverUrl || effectiveSeriesCoverUrl;

  async function refreshContent(nextSelectedId?: string) {
    const localSeries = getManagedSeries();
    const localEpisodes = getManagedEpisodes();
    setSeriesItems(localSeries);
    setEpisodeItems(localEpisodes);
    try {
      const [seriesResult, episodeResult] = await Promise.all([
        adminFetch<ApiListResponse<ManagedSeries>>("/api/admin/series"),
        adminFetch<ApiListResponse<ManagedEpisode>>("/api/admin/episodes")
      ]);
      setMode(seriesResult.mode);
      if (seriesResult.mode === "supabase") setSeriesItems(seriesResult.items);
      if (episodeResult.mode === "supabase") setEpisodeItems(episodeResult.items);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "读取云端内容失败。");
    }
    if (nextSelectedId) setSelectedSeriesId(nextSelectedId);
  }

  useEffect(() => {
    void refreshContent();
  }, []);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!categoryTouched) {
      const suggested = suggestCategories(value);
      if (suggested) setCategoryInput(suggested);
    }
  }

  function toggleCategory(tag: string) {
    setCategoryTouched(true);
    const current = splitCategories(categoryInput);
    const next = current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag];
    setCategoryInput(joinCategories(next));
  }

  function handleSeriesChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextId = event.target.value;
    const nextSeries = seriesItems.find((series) => series.id === nextId);
    setSelectedSeriesId(nextId);
    setTitle(nextSeries?.titleZh || "");
    setCategoryInput(nextSeries?.categoryZh?.join(" / ") || "");
    setCategoryTouched(Boolean(nextSeries));
    setSeriesCoverUrl("");
    setEpisodeCoverUrl("");
    setSeriesCoverPreview(nextSeries?.coverUrl || "");
    setEpisodeCoverPreview("");
    setMessage(nextId === NEW_SERIES ? "将创建一个新作品。" : "已选择已有作品。可以替换总封面，也可以继续上传新剧集。");
  }

  async function uploadSeriesCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("正在上传作品总封面图...");
    setSeriesCoverPreview(URL.createObjectURL(file));
    try {
      const result = await uploadImageFile(file);
      setSeriesCoverUrl(result.publicUrl);
      setSeriesCoverPreview(result.publicUrl);
      setMessage(result.message || "作品总封面图上传好了。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "作品总封面图上传失败。");
    }
  }

  async function uploadEpisodeCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("正在上传本集封面图...");
    setEpisodeCoverPreview(URL.createObjectURL(file));
    try {
      const result = await uploadImageFile(file);
      setEpisodeCoverUrl(result.publicUrl);
      setEpisodeCoverPreview(result.publicUrl);
      setMessage(result.message || "本集封面图上传好了。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "本集封面图上传失败。");
    }
  }

  async function uploadVideo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("正在上传视频，文件大时请等一会儿...");
    setVideoPreview(URL.createObjectURL(file));
    const formData = new FormData();
    formData.set("file", file);
    try {
      const result = await adminFetch<{ publicUrl: string; message?: string }>("/api/admin/upload-video", {
        method: "POST",
        body: formData
      });
      setVideoUrl(result.publicUrl);
      setVideoPreview(result.publicUrl);
      setMessage(result.message || "视频上传好了。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "视频上传失败。");
    }
  }

  async function replaceSeriesCoverOnly() {
    if (!selectedSeries) {
      setMessage("请先选择一个已有作品，再替换总封面。");
      return;
    }
    if (!seriesCoverUrl) {
      setMessage("请先选择一张新的作品总封面图。");
      return;
    }

    const categories = splitCategories(categoryInput);
    const updatedSeries: ManagedSeries = {
      ...selectedSeries,
      titleZh: title || selectedSeries.titleZh,
      titleEn: selectedSeries.titleEn || title || selectedSeries.titleZh,
      categoryZh: categories.length ? categories : selectedSeries.categoryZh,
      categoryEn: categories.length ? categories : selectedSeries.categoryEn,
      coverUrl: seriesCoverUrl,
      heroImageUrl: seriesCoverUrl,
      status: "published"
    };
    try {
      if (mode === "supabase") {
        await adminFetch(`/api/admin/series/${updatedSeries.id}`, { method: "PUT", body: JSON.stringify(updatedSeries) });
      } else {
        upsertManagedSeries(updatedSeries);
      }
      await refreshContent(updatedSeries.id);
      setSeriesCoverUrl("");
      setMessage(mode === "supabase" ? "作品总封面已保存到 Supabase。" : `《${updatedSeries.titleZh}》的作品总封面已保存到本地模式。`);
    } catch (error) {
      setMessage(error instanceof Error ? `保存失败：${error.message}` : "保存失败。");
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) {
      setMessage("先填写作品名，或选择一个已有作品。");
      return;
    }
    if (!effectiveSeriesCoverUrl) {
      setMessage("新作品需要先选择一张作品总封面图。");
      return;
    }
    if (!videoUrl) {
      setMessage("请选择一个视频文件。如果只是换总封面，请点“只替换作品总封面”。");
      return;
    }

    setSaving(true);
    const categories = splitCategories(categoryInput);
    const isNewSeries = !selectedSeries;
    const seriesId = selectedSeries?.id || createLocalId("series");
    const slug = selectedSeries?.slug || slugify(title);
    const episodeNumber = selectedSeries ? getNextEpisodeNumber(seriesId, episodeItems) : 1;
    const series: ManagedSeries = {
      ...(selectedSeries || {
        id: seriesId,
        slug,
        titleEn: title,
        descriptionZh: "",
        descriptionEn: "",
        categoryZh: ["原创"],
        categoryEn: ["Original"],
        badge: "NEW",
        isVip: false,
        isFeatured: true,
        views: 0,
        followers: 0,
        sortOrder: 0
      }),
      id: seriesId,
      slug,
      titleZh: title,
      titleEn: selectedSeries?.titleEn || title,
      categoryZh: categories.length ? categories : selectedSeries?.categoryZh || ["原创"],
      categoryEn: categories.length ? categories : selectedSeries?.categoryEn || ["Original"],
      coverUrl: effectiveSeriesCoverUrl,
      heroImageUrl: seriesCoverUrl || selectedSeries?.heroImageUrl || effectiveSeriesCoverUrl,
      episodeCount: Math.max(Number(selectedSeries?.episodeCount) || 0, episodeNumber),
      status: "published"
    };
    const episode: ManagedEpisode = {
      id: `${slug}-ep-${episodeNumber}-${Date.now()}`,
      seriesId,
      titleZh: episodeTitle || `第 ${episodeNumber} 话`,
      titleEn: episodeTitle || `Episode ${episodeNumber}`,
      episodeNumber,
      descriptionZh: "",
      descriptionEn: "",
      thumbnailUrl: effectiveEpisodeCoverUrl,
      previewVideoUrl: videoUrl,
      fullVideoUrl: videoUrl,
      accessType: "free",
      duration: "",
      releaseDate: new Date().toISOString().slice(0, 10),
      status: "published",
      sortOrder: episodeNumber
    };

    try {
      let savedSeries = series;
      if (mode === "supabase") {
        const seriesResult = await adminFetch<ApiItemResponse<ManagedSeries>>(
          isNewSeries ? "/api/admin/series" : `/api/admin/series/${series.id}`,
          { method: isNewSeries ? "POST" : "PUT", body: JSON.stringify(series) }
        );
        if (!seriesResult.item) throw new Error("Supabase 未返回作品数据。");
        savedSeries = seriesResult.item;
        episode.seriesId = savedSeries.id;
        await adminFetch<ApiItemResponse<ManagedEpisode>>("/api/admin/episodes", {
          method: "POST",
          body: JSON.stringify(episode)
        });
      } else {
        upsertManagedSeries(series);
        upsertManagedEpisode(episode);
      }
      await refreshContent(savedSeries.id);
      setVideoUrl("");
      setVideoPreview("");
      setEpisodeCoverUrl("");
      setEpisodeCoverPreview("");
      setEpisodeTitle("");
      setMessage(mode === "supabase" ? "作品和剧集已保存到 Supabase。" : isNewSeries ? "已保存到本地模式。新作品和第 1 话已发布。" : `已保存到本地模式，并加入《${series.titleZh}》第 ${episodeNumber} 话。`);
    } catch (error) {
      setMessage(error instanceof Error ? `保存失败：${error.message}` : "保存失败。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">QUICK UPLOAD</p>
          <h1>快捷上传作品</h1>
          <p>分类会根据作品名先自动建议，也可以直接点标签调整。</p>
        </div>
      </div>

      <section className="admin-panel quick-upload-panel">
        <form className="quick-upload-form" onSubmit={save}>
          <label>
            上传到哪个作品
            <select value={selectedSeriesId} onChange={handleSeriesChange}>
              <option value={NEW_SERIES}>新建作品</option>
              {seriesItems.map((series) => (
                <option key={series.id} value={series.id}>{series.titleZh}</option>
              ))}
            </select>
          </label>

          <label>
            作品名
            <input value={title} onChange={(event) => handleTitleChange(event.target.value)} placeholder="例如：小汐的日记、仙侠战士群像" />
          </label>

          <label>
            作品分类
            <input value={categoryInput} onChange={(event) => { setCategoryTouched(true); setCategoryInput(event.target.value); }} placeholder="可自动建议，也可点下方标签" />
          </label>

          <div className="quick-tag-row" aria-label="作品分类标签">
            {CATEGORY_TAGS.map((tag) => (
              <button key={tag} type="button" className={selectedCategories.includes(tag) ? "active" : ""} onClick={() => toggleCategory(tag)}>
                {tag}
              </button>
            ))}
          </div>

          <label>
            作品总封面图（漫剧库卡片）
            {seriesCoverPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="quick-upload-preview" src={seriesCoverPreview} alt="" />
            ) : null}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadSeriesCover} />
          </label>

          <div className="admin-form-actions">
            <button className="btn dark-outline" type="button" disabled={!selectedSeries || !seriesCoverUrl} onClick={replaceSeriesCoverOnly}>
              只替换作品总封面
            </button>
          </div>

          <label>
            本次上传为
            <input value={`第 ${nextEpisodeNumber} 话`} readOnly />
          </label>

          <label>
            本集标题
            <input value={episodeTitle} onChange={(event) => setEpisodeTitle(event.target.value)} placeholder="例如：第一话-妈妈给我报了5个补习班" />
          </label>

          <label>
            本集封面图（单集缩略图）
            {episodeCoverPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="quick-upload-preview" src={episodeCoverPreview} alt="" />
            ) : null}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadEpisodeCover} />
          </label>

          <label>
            剧集视频文件
            {videoPreview ? <video className="quick-upload-video" src={videoPreview} controls preload="metadata" /> : null}
            <input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-matroska" onChange={uploadVideo} />
          </label>

          <div className="admin-form-actions">
            <button className="btn primary" type="submit" disabled={saving}>
              {saving ? "保存中..." : "保存并发布新剧集"}
            </button>
            <Link className="btn dark-outline" href="/series">打开本地前台</Link>
          </div>

          {message ? <p className="admin-form-error">{message}</p> : null}
        </form>
      </section>
    </AdminAuthGate>
  );
}
