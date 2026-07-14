"use client";

import type { CmsEpisode, CmsHeroSlide, CmsSeries } from "@/lib/cms-types";
import {
  episodes as mockEpisodes,
  seriesList as mockSeriesList,
  type Episode,
  type Series,
  type SeriesBadge,
  type SeriesStatus
} from "@/lib/mock-data";

export type ManagedSeries = CmsSeries;
export type ManagedEpisode = CmsEpisode;
export type ManagedHeroSlide = CmsHeroSlide;

export const SERIES_STORAGE_KEY = "zen_admin_series";
export const EPISODES_STORAGE_KEY = "zen_admin_episodes";
export const HERO_STORAGE_KEY = "zen_admin_hero_slides";
export const ADMIN_PASSWORD_STORAGE_KEY = "zen-admin-password";

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

export function getAdminPassword() {
  if (typeof window === "undefined") return "";
  return window.sessionStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) || "";
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

export function getManagedHeroSlides() {
  return readJsonArray<ManagedHeroSlide>(HERO_STORAGE_KEY);
}

export function saveManagedHeroSlides(items: ManagedHeroSlide[]) {
  writeJsonArray(HERO_STORAGE_KEY, items);
}

export function upsertManagedHeroSlide(item: ManagedHeroSlide) {
  const items = getManagedHeroSlides();
  const next = items.some((slide) => slide.id === item.id)
    ? items.map((slide) => slide.id === item.id ? item : slide)
    : [item, ...items];
  saveManagedHeroSlides(next);
}

export function cmsSeriesToSeries(item: ManagedSeries): Series {
  return {
    id: item.id,
    slug: item.slug,
    titleZh: item.titleZh,
    titleEn: item.titleEn || item.titleZh,
    descriptionZh: item.descriptionZh || "",
    descriptionEn: item.descriptionEn || item.descriptionZh || "",
    categoryZh: item.categoryZh,
    categoryEn: item.categoryEn,
    cover: item.coverUrl || "/images/covers/youth.svg",
    heroImage: item.heroImageUrl || item.coverUrl || "/images/hero/hero-01.svg",
    badge: (item.badge || "HOT") as SeriesBadge,
    episodeCount: Number(item.episodeCount) || 0,
    isVip: Boolean(item.isVip),
    views: Number(item.views) || 0,
    followers: Number(item.followers) || 0,
    updatedAt: item.updatedAt || new Date().toISOString().slice(0, 10),
    status: (item.status === "published" ? "live" : "upcoming") as SeriesStatus,
    isFeatured: Boolean(item.isFeatured)
  };
}

export function cmsEpisodeToEpisode(item: ManagedEpisode): Episode {
  return {
    id: item.id,
    seriesId: item.seriesId,
    titleZh: item.titleZh,
    titleEn: item.titleEn || item.titleZh,
    episodeNumber: Number(item.episodeNumber) || 1,
    thumbnail: item.thumbnailUrl || "/images/covers/youth.svg",
    videoUrl: item.accessType === "preview"
      ? item.previewVideoUrl || item.fullVideoUrl
      : item.fullVideoUrl || item.previewVideoUrl,
    isVip: item.accessType === "vip",
    isFree: item.accessType === "free",
    accessType: item.accessType,
    duration: item.duration || "00:00",
    releaseDate: item.releaseDate || new Date().toISOString().slice(0, 10)
  };
}

export function getPublishedContent() {
  const localSeries = getManagedSeries()
    .filter((item) => item.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const localEpisodes = getManagedEpisodes()
    .filter((item) => item.status === "published")
    .sort((a, b) => a.sortOrder - b.sortOrder || a.episodeNumber - b.episodeNumber);
  const localHeroSlides = getManagedHeroSlides()
    .filter((item) => item.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!localSeries.length && !localEpisodes.length && !localHeroSlides.length) {
    return { series: mockSeriesList, episodes: mockEpisodes, heroSlides: [] as ManagedHeroSlide[] };
  }

  return {
    series: localSeries.length ? localSeries.map(cmsSeriesToSeries) : mockSeriesList,
    episodes: localEpisodes.length ? localEpisodes.map(cmsEpisodeToEpisode) : mockEpisodes,
    heroSlides: localHeroSlides
  };
}
