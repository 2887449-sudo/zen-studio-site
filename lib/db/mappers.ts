import type { CmsEpisode, CmsHeroSlide, CmsSeries } from "@/lib/cms-types";

type Row = Record<string, unknown>;

function textArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === "number" ? value : fallback;
}

function booleanValue(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

export function mapSeriesRow(row: Row): CmsSeries {
  return {
    id: stringValue(row.id),
    slug: stringValue(row.slug),
    titleZh: stringValue(row.title_zh),
    titleEn: stringValue(row.title_en),
    descriptionZh: stringValue(row.description_zh),
    descriptionEn: stringValue(row.description_en),
    categoryZh: textArray(row.category_zh),
    categoryEn: textArray(row.category_en),
    coverUrl: stringValue(row.cover_url),
    heroImageUrl: stringValue(row.hero_image_url),
    badge: stringValue(row.badge),
    isVip: booleanValue(row.is_vip),
    isFeatured: booleanValue(row.is_featured),
    status: stringValue(row.status, "draft") as CmsSeries["status"],
    episodeCount: numberValue(row.episode_count),
    views: numberValue(row.views),
    followers: numberValue(row.followers),
    sortOrder: numberValue(row.sort_order),
    createdAt: stringValue(row.created_at),
    updatedAt: stringValue(row.updated_at)
  };
}

export function seriesToRow(item: Partial<CmsSeries>) {
  return {
    slug: item.slug,
    title_zh: item.titleZh,
    title_en: item.titleEn,
    description_zh: item.descriptionZh,
    description_en: item.descriptionEn,
    category_zh: item.categoryZh ?? [],
    category_en: item.categoryEn ?? [],
    cover_url: item.coverUrl,
    hero_image_url: item.heroImageUrl,
    badge: item.badge,
    is_vip: item.isVip ?? false,
    is_featured: item.isFeatured ?? false,
    status: item.status ?? "draft",
    episode_count: item.episodeCount ?? 0,
    views: item.views ?? 0,
    followers: item.followers ?? 0,
    sort_order: item.sortOrder ?? 0,
    updated_at: new Date().toISOString()
  };
}

export function mapEpisodeRow(row: Row): CmsEpisode {
  return {
    id: stringValue(row.id),
    seriesId: stringValue(row.series_id),
    titleZh: stringValue(row.title_zh),
    titleEn: stringValue(row.title_en),
    episodeNumber: numberValue(row.episode_number, 1),
    descriptionZh: stringValue(row.description_zh),
    descriptionEn: stringValue(row.description_en),
    thumbnailUrl: stringValue(row.thumbnail_url),
    previewVideoUrl: stringValue(row.preview_video_url),
    fullVideoUrl: stringValue(row.full_video_url),
    accessType: stringValue(row.access_type, "vip") as CmsEpisode["accessType"],
    duration: stringValue(row.duration),
    releaseDate: stringValue(row.release_date),
    status: stringValue(row.status, "draft") as CmsEpisode["status"],
    sortOrder: numberValue(row.sort_order),
    createdAt: stringValue(row.created_at),
    updatedAt: stringValue(row.updated_at)
  };
}

export function episodeToRow(item: Partial<CmsEpisode>) {
  return {
    series_id: item.seriesId,
    title_zh: item.titleZh,
    title_en: item.titleEn,
    episode_number: item.episodeNumber ?? 1,
    description_zh: item.descriptionZh,
    description_en: item.descriptionEn,
    thumbnail_url: item.thumbnailUrl,
    preview_video_url: item.previewVideoUrl,
    full_video_url: item.fullVideoUrl,
    access_type: item.accessType ?? "vip",
    duration: item.duration,
    release_date: item.releaseDate || null,
    status: item.status ?? "draft",
    sort_order: item.sortOrder ?? 0,
    updated_at: new Date().toISOString()
  };
}

export function mapHeroRow(row: Row): CmsHeroSlide {
  return {
    id: stringValue(row.id),
    titleZh: stringValue(row.title_zh),
    titleEn: stringValue(row.title_en),
    subtitleZh: stringValue(row.subtitle_zh),
    subtitleEn: stringValue(row.subtitle_en),
    badgeZh: stringValue(row.badge_zh),
    badgeEn: stringValue(row.badge_en),
    episodeInfoZh: stringValue(row.episode_info_zh),
    episodeInfoEn: stringValue(row.episode_info_en),
    imageUrl: stringValue(row.image_url),
    seriesSlug: stringValue(row.series_slug),
    isActive: booleanValue(row.is_active, true),
    sortOrder: numberValue(row.sort_order),
    createdAt: stringValue(row.created_at),
    updatedAt: stringValue(row.updated_at)
  };
}

export function heroToRow(item: Partial<CmsHeroSlide>) {
  return {
    title_zh: item.titleZh,
    title_en: item.titleEn,
    subtitle_zh: item.subtitleZh,
    subtitle_en: item.subtitleEn,
    badge_zh: item.badgeZh,
    badge_en: item.badgeEn,
    episode_info_zh: item.episodeInfoZh,
    episode_info_en: item.episodeInfoEn,
    image_url: item.imageUrl,
    series_slug: item.seriesSlug,
    is_active: item.isActive ?? true,
    sort_order: item.sortOrder ?? 0,
    updated_at: new Date().toISOString()
  };
}
