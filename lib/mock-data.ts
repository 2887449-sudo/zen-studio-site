export type Locale = "zh" | "en";

export type SeriesBadge = "VIP" | "独家" | "更新中" | "HOT" | "即将上线";
export type SeriesStatus = "live" | "upcoming";

export type Series = {
  id: string;
  slug: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
  categoryZh: string[];
  categoryEn: string[];
  cover: string;
  heroImage: string;
  badge: SeriesBadge;
  episodeCount: number;
  isVip: boolean;
  views: number;
  followers: number;
  updatedAt: string;
  status: SeriesStatus;
  isFeatured?: boolean;
};

export type Episode = {
  id: string;
  seriesId: string;
  titleZh: string;
  titleEn: string;
  episodeNumber: number;
  thumbnail: string;
  videoUrl?: string;
  isVip: boolean;
  isFree: boolean;
  accessType?: EpisodeAccess;
  duration: string;
  releaseDate: string;
};

export type EpisodeAccess = "free" | "preview" | "vip";

export const seriesList: Series[] = [
  {
    id: "s0",
    slug: "xiaoxi-campus-diary",
    titleZh: "小汐的校园显眼包日记",
    titleEn: "Xiaoxi's Campus Spotlight Diary",
    descriptionZh: "小汐每天都想低调生活，却总被奇怪同学、离谱社团和意外名场面推到全校焦点。",
    descriptionEn: "Xiaoxi wants a quiet school life, but strange classmates, wild clubs, and viral moments keep putting her in the spotlight.",
    categoryZh: ["校园", "搞笑", "日常"],
    categoryEn: ["School", "Comedy", "Slice of Life"],
    cover: "/images/covers/xiaoxi.svg",
    heroImage: "/images/hero/xiaoxi-hero.svg",
    badge: "HOT",
    episodeCount: 5,
    isVip: false,
    views: 1568000,
    followers: 186300,
    updatedAt: "2026-06-17",
    status: "live"
  },
  {
    id: "s1",
    slug: "youth-never-crashes",
    titleZh: "青春不翻车",
    titleEn: "Youth Never Crashes",
    descriptionZh: "热闹校园里的社团少年被卷入一连串离奇任务，在友情、误会和笑点之间一路冲刺。",
    descriptionEn: "A group of school friends tumble into strange missions, turning every misunderstanding into a fast-moving comedy.",
    categoryZh: ["校园", "搞笑"],
    categoryEn: ["School", "Comedy"],
    cover: "/images/covers/youth.svg",
    heroImage: "/images/hero/hero-01.svg",
    badge: "独家",
    episodeCount: 32,
    isVip: false,
    views: 938000,
    followers: 86100,
    updatedAt: "2026-06-17",
    status: "live"
  },
  {
    id: "s2",
    slug: "echoes-of-the-abyss",
    titleZh: "深渊回响",
    titleEn: "Echoes of the Abyss",
    descriptionZh: "一桩失踪案撕开城市暗面，旧录音、无名信件与深海传说交织成逐集升级的悬疑迷局。",
    descriptionEn: "A disappearance opens the hidden underside of the city through recordings, anonymous letters, and abyssal legends.",
    categoryZh: ["悬疑", "惊悚"],
    categoryEn: ["Mystery", "Thriller"],
    cover: "/images/covers/abyss.svg",
    heroImage: "/images/hero/hero-02.svg",
    badge: "VIP",
    episodeCount: 18,
    isVip: true,
    views: 1268000,
    followers: 124300,
    updatedAt: "2026-06-17",
    status: "live"
  },
  {
    id: "s3",
    slug: "stardust-protocol",
    titleZh: "星尘协议",
    titleEn: "Stardust Protocol",
    descriptionZh: "近未来轨道城里，一份被加密的星尘协议改变了人类与 AI 共生的边界。",
    descriptionEn: "In a near-future orbital city, an encrypted protocol redraws the boundary between humanity and AI.",
    categoryZh: ["科幻", "未来"],
    categoryEn: ["Sci-Fi", "Future"],
    cover: "/images/covers/stardust.svg",
    heroImage: "/images/hero/hero-03.svg",
    badge: "独家",
    episodeCount: 24,
    isVip: true,
    views: 884000,
    followers: 77900,
    updatedAt: "2026-06-16",
    status: "live"
  },
  {
    id: "s4",
    slug: "nightwalkers-agency",
    titleZh: "夜行者事务所",
    titleEn: "Nightwalkers Agency",
    descriptionZh: "夜色降临后，城市里最棘手的奇幻委托都会送到这间永不打烊的事务所。",
    descriptionEn: "After dark, the city's strangest fantasy cases arrive at an agency that never closes.",
    categoryZh: ["都市", "奇幻"],
    categoryEn: ["Urban", "Fantasy"],
    cover: "/images/covers/nightwalker.svg",
    heroImage: "/images/hero/hero-02.svg",
    badge: "VIP",
    episodeCount: 28,
    isVip: true,
    views: 1104000,
    followers: 105600,
    updatedAt: "2026-06-16",
    status: "live"
  },
  {
    id: "s5",
    slug: "season-of-her-and-flowers",
    titleZh: "她与花的季节",
    titleEn: "The Season of Her and Flowers",
    descriptionZh: "花店少女在四季轮转中遇见不同的人，也慢慢找回被自己遗忘的勇气。",
    descriptionEn: "A flower shop girl meets different lives through the seasons and slowly rediscovers her courage.",
    categoryZh: ["少女", "成长"],
    categoryEn: ["Girlhood", "Coming-of-age"],
    cover: "/images/covers/flower-season.svg",
    heroImage: "/images/hero/hero-03.svg",
    badge: "更新中",
    episodeCount: 16,
    isVip: false,
    views: 642000,
    followers: 53100,
    updatedAt: "2026-06-15",
    status: "live"
  },
  {
    id: "s6",
    slug: "burning-domain",
    titleZh: "燃尽领域",
    titleEn: "Burning Domain",
    descriptionZh: "被火焰选中的少年踏入禁区，在失控的力量与伙伴的信任之间寻找自己的边界。",
    descriptionEn: "A boy chosen by fire enters a forbidden domain, testing power, loyalty, and the edge of survival.",
    categoryZh: ["热血", "冒险"],
    categoryEn: ["Action", "Adventure"],
    cover: "/images/covers/burning-domain.svg",
    heroImage: "/images/hero/hero-01.svg",
    badge: "HOT",
    episodeCount: 40,
    isVip: true,
    views: 998000,
    followers: 90300,
    updatedAt: "2026-06-14",
    status: "live"
  },
  {
    id: "s7",
    slug: "rainy-night-store",
    titleZh: "雨夜便利店",
    titleEn: "Rainy Night Store",
    descriptionZh: "每个雨夜零点后，便利店都会出现来自不同时间线的客人。",
    descriptionEn: "After midnight on rainy nights, a convenience store welcomes customers from different timelines.",
    categoryZh: ["悬疑", "都市"],
    categoryEn: ["Mystery", "Urban"],
    cover: "/images/covers/rainy-store.svg",
    heroImage: "/images/hero/hero-02.svg",
    badge: "即将上线",
    episodeCount: 0,
    isVip: true,
    views: 0,
    followers: 29400,
    updatedAt: "2026-07-01",
    status: "upcoming"
  },
  {
    id: "s8",
    slug: "backlight-girl",
    titleZh: "逆光少女",
    titleEn: "Backlight Girl",
    descriptionZh: "总在逆光里出现的少女，带着一台能拍下未来片段的旧相机。",
    descriptionEn: "A girl who always appears against the light carries an old camera that captures fragments of the future.",
    categoryZh: ["少女", "奇幻"],
    categoryEn: ["Girlhood", "Fantasy"],
    cover: "/images/covers/backlight-girl.svg",
    heroImage: "/images/hero/hero-03.svg",
    badge: "即将上线",
    episodeCount: 0,
    isVip: false,
    views: 0,
    followers: 33600,
    updatedAt: "2026-07-08",
    status: "upcoming"
  },
  {
    id: "s9",
    slug: "after-ninth-class",
    titleZh: "第九节课后",
    titleEn: "After the Ninth Class",
    descriptionZh: "第九节课铃响后，空教室会打开通往另一个校园的门。",
    descriptionEn: "After the ninth bell, an empty classroom opens a door to another campus.",
    categoryZh: ["校园", "悬疑"],
    categoryEn: ["School", "Mystery"],
    cover: "/images/covers/ninth-class.svg",
    heroImage: "/images/hero/hero-01.svg",
    badge: "即将上线",
    episodeCount: 0,
    isVip: true,
    views: 0,
    followers: 41200,
    updatedAt: "2026-07-15",
    status: "upcoming"
  },
  {
    id: "s10",
    slug: "mist-city-letter",
    titleZh: "雾城来信",
    titleEn: "Letters from the Fog City",
    descriptionZh: "雾气封城的第七天，少女收到一封来自未来自己的信。",
    descriptionEn: "On the seventh day after fog sealed the city, a girl receives a letter from her future self.",
    categoryZh: ["悬疑", "都市"],
    categoryEn: ["Mystery", "Urban"],
    cover: "/images/covers/mist-city-letter.svg",
    heroImage: "/images/hero/hero-02.svg",
    badge: "即将上线",
    episodeCount: 0,
    isVip: true,
    views: 0,
    followers: 38200,
    updatedAt: "2026-07-22",
    status: "upcoming"
  },
  {
    id: "s11",
    slug: "after-school-isekai",
    titleZh: "放学后的异世界",
    titleEn: "After-School Isekai",
    descriptionZh: "放学铃声响起后，旧教学楼会把留下的人送进另一个世界。",
    descriptionEn: "After the final bell, the old school building sends anyone who stays behind into another world.",
    categoryZh: ["校园", "奇幻"],
    categoryEn: ["School", "Fantasy"],
    cover: "/images/covers/after-school-isekai.svg",
    heroImage: "/images/hero/hero-03.svg",
    badge: "即将上线",
    episodeCount: 0,
    isVip: false,
    views: 0,
    followers: 44700,
    updatedAt: "2026-07-29",
    status: "upcoming"
  }
];

const liveSeries = seriesList.filter((series) => series.status === "live");

export const episodes: Episode[] = liveSeries.flatMap((series) =>
  Array.from({ length: Math.max(5, Math.min(series.episodeCount, 12)) }, (_, index) => {
    const episodeNumber = index + 1;
    return {
      id: `${series.slug}-ep-${episodeNumber}`,
      seriesId: series.id,
      titleZh: episodeNumber === 1 ? "第 1 话 入口" : episodeNumber === 2 ? "第 2 话 试看片段" : `第 ${episodeNumber} 话`,
      titleEn: episodeNumber === 1 ? "Episode 1: The Opening" : episodeNumber === 2 ? "Episode 2: Preview Cut" : `Episode ${episodeNumber}`,
      episodeNumber,
      thumbnail: `/images/episodes/${series.slug}-${episodeNumber}.svg`,
      videoUrl: episodeNumber <= 2 ? `/videos/mock/${series.slug}-${episodeNumber}.mp4` : undefined,
      isVip: episodeNumber >= 3,
      isFree: episodeNumber === 1,
      duration: `${8 + (episodeNumber % 5)}:${episodeNumber % 2 === 0 ? "42" : "18"}`,
      releaseDate: `2026-06-${String(18 - index).padStart(2, "0")}`
    };
  })
);

export const latestUpdates = [
  { seriesSlug: "xiaoxi-campus-diary", episodeNumber: 5, timeZh: "今天 21:30", timeEn: "Today 21:30" },
  { seriesSlug: "echoes-of-the-abyss", episodeNumber: 9, timeZh: "今天 21:00", timeEn: "Today 21:00" },
  { seriesSlug: "nightwalkers-agency", episodeNumber: 9, timeZh: "今天 19:30", timeEn: "Today 19:30" },
  { seriesSlug: "burning-domain", episodeNumber: 1, timeZh: "昨天 22:10", timeEn: "Yesterday 22:10" }
];

export const rankingSeries = ["xiaoxi-campus-diary", "echoes-of-the-abyss", "nightwalkers-agency", "burning-domain", "stardust-protocol"];

export function getSeriesBySlug(slug: string) {
  return seriesList.find((series) => series.slug === slug);
}

export function getSeriesById(seriesId: string) {
  return seriesList.find((series) => series.id === seriesId);
}

export function getSeriesEpisodes(seriesId: string) {
  return episodes.filter((episode) => episode.seriesId === seriesId);
}

export function getEpisodeById(episodeId: string) {
  return episodes.find((episode) => episode.id === episodeId);
}

export function getEpisodeAccess(episode: Episode): EpisodeAccess {
  if (episode.accessType) return episode.accessType;
  if (episode.isFree) return "free";
  if (episode.episodeNumber === 2) return "preview";
  return "vip";
}

export function getSeriesTitle(series: Series, locale: Locale) {
  return locale === "zh" ? series.titleZh : series.titleEn;
}

export function getSeriesDescription(series: Series, locale: Locale) {
  return locale === "zh" ? series.descriptionZh : series.descriptionEn;
}

export function getSeriesCategories(series: Series, locale: Locale) {
  return locale === "zh" ? series.categoryZh : series.categoryEn;
}

export function formatNumber(value: number, locale: Locale) {
  if (value === 0) return locale === "zh" ? "预约中" : "Soon";
  if (value >= 10000 && locale === "zh") return `${(value / 10000).toFixed(1)}万`;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return String(value);
}
