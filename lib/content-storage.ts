"use client";

import {
  episodes as mockEpisodes,
  seriesList as mockSeriesList,
  type Episode,
  type Series,
  type SeriesBadge,
  type SeriesStatus
} from "@/lib/mock-data";

export type ManagedSeriesStatus = "draft" | "published";
export type ManagedEpisodeStatus = "draft" | "published";
export type ManagedEpisodeAccess = "free" | "preview" | "vip";

export type ManagedSeries = {
  id: string;
  titleZh: string;
  titleEn: string;
  slug: string;
  descriptionZh: string;
  descriptionEn: string;
  categoryZh: string;
  categoryEn: string;
  coverUrl: string;
  heroImageUrl: string;
  badge: string;
  isVip: boolean;
  status: ManagedSeriesStatus;
  episodeCount: number;
  isFeatured: boolean;
};

export type ManagedEpisode = {
  id: string;
  seriesId: string;
  titleZh: string;
  titleEn: string;
  episodeNumber: number;
  thumbnailUrl: string;
  previewVideoUrl: string;
  fullVideoUrl: string;
  accessType: ManagedEpisodeAccess;
  duration: string;
  releaseDate: string;
  status: ManagedEpisodeStatus;
};

export const SERIES_STORAGE_KEY = "zen_admin_series";
export const EPISODES_STORAGE_KEY = "zen_admin_episodes";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJsonArray<T>(key: string): T[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

function writeJsonArray<T>(key: string, value: T[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event("zen-content-change"));
}

export function createLocalId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getManagedSeries() {
  return readJsonArray<ManagedSeries>(SERIES_STORAGE_KEY);
}

export function saveManagedSeries(items: ManagedSeries[]) {
  writeJsonArray(SERIES_STORAGE_KEY, items);
}

export function upsertManagedSeries(item: ManagedSeries) {
  const items = getManagedSeries();
  const next = items.some((series) => series.id === item.id)
    ? items.map((series) => series.id === item.id ? item : series)
    : [item, ...items];
  saveManagedSeries(next);
}

export function getManagedEpisodes() {
  return readJsonArray<ManagedEpisode>(EPISODES_STORAGE_KEY);
}

export function saveManagedEpisodes(items: ManagedEpisode[]) {
  writeJsonArray(EPISODES_STORAGE_KEY, items);
}

export function upsertManagedEpisode(item: ManagedEpisode) {
  const items = getManagedEpisodes();
  const next = items.some((episode) => episode.id === item.id)
    ? items.map((episode) => episode.id === item.id ? item : episode)
    : [item, ...items];
  saveManagedEpisodes(next);
}

function splitCategories(value: string) {
  return value.split(/[、,\/]/).map((item) => item.trim()).filter(Boolean);
}

function toSeries(item: ManagedSeries): Series {
  return {
    id: item.id,
    slug: item.slug,
    titleZh: item.titleZh,
    titleEn: item.titleEn,
    descriptionZh: item.descriptionZh,
    descriptionEn: item.descriptionEn,
    categoryZh: splitCategories(item.categoryZh),
    categoryEn: splitCategories(item.categoryEn),
    cover: item.coverUrl || "/images/covers/youth.svg",
    heroImage: item.heroImageUrl || item.coverUrl || "/images/hero/hero-01.svg",
    badge: (item.badge || "HOT") as SeriesBadge,
    episodeCount: Number(item.episodeCount) || 0,
    isVip: Boolean(item.isVip),
    views: 0,
    followers: 0,
    updatedAt: new Date().toISOString().slice(0, 10),
    status: item.status === "published" ? "live" : "upcoming" as SeriesStatus
  };
}

function toEpisode(item: ManagedEpisode): Episode {
  return {
    id: item.id,
    seriesId: item.seriesId,
    titleZh: item.titleZh,
    titleEn: item.titleEn,
    episodeNumber: Number(item.episodeNumber) || 1,
    thumbnail: item.thumbnailUrl || "/images/covers/youth.svg",
    videoUrl: item.accessType === "free" ? item.fullVideoUrl : item.previewVideoUrl,
    isVip: item.accessType === "vip",
    isFree: item.accessType === "free",
    duration: item.duration || "00:00",
    releaseDate: item.releaseDate || new Date().toISOString().slice(0, 10)
  };
}

export function getPublishedContent() {
  const localSeries = getManagedSeries().filter((item) => item.status === "published");
  const localEpisodes = getManagedEpisodes().filter((item) => item.status === "published");

  if (!localSeries.length && !localEpisodes.length) {
    return { series: mockSeriesList, episodes: mockEpisodes };
  }

  const convertedSeries = localSeries.map(toSeries);
  const convertedEpisodes = localEpisodes.map(toEpisode);
  return {
    series: convertedSeries.length ? convertedSeries : mockSeriesList,
    episodes: convertedEpisodes.length ? convertedEpisodes : mockEpisodes
  };
}
