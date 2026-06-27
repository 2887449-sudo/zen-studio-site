export type CmsStatus = "draft" | "published" | "archived";
export type EpisodeAccessType = "free" | "preview" | "vip";

export type CmsSeries = {
  id: string;
  slug: string;
  titleZh: string;
  titleEn?: string;
  descriptionZh?: string;
  descriptionEn?: string;
  categoryZh: string[];
  categoryEn: string[];
  coverUrl?: string;
  heroImageUrl?: string;
  badge?: string;
  isVip: boolean;
  isFeatured: boolean;
  status: CmsStatus;
  episodeCount: number;
  views: number;
  followers: number;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CmsEpisode = {
  id: string;
  seriesId: string;
  titleZh: string;
  titleEn?: string;
  episodeNumber: number;
  descriptionZh?: string;
  descriptionEn?: string;
  thumbnailUrl?: string;
  previewVideoUrl?: string;
  fullVideoUrl?: string;
  accessType: EpisodeAccessType;
  duration?: string;
  releaseDate?: string;
  status: CmsStatus;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CmsHeroSlide = {
  id: string;
  titleZh: string;
  titleEn?: string;
  subtitleZh?: string;
  subtitleEn?: string;
  badgeZh?: string;
  badgeEn?: string;
  episodeInfoZh?: string;
  episodeInfoEn?: string;
  imageUrl?: string;
  seriesSlug?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
};

export type CmsMode = "supabase" | "local";

export type ApiListResponse<T> = {
  mode: CmsMode;
  items: T[];
  message?: string;
};

export type ApiItemResponse<T> = {
  mode: CmsMode;
  item: T | null;
  message?: string;
};
