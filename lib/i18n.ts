import type { Locale } from "./mock-data";

export const messages = {
  zh: {
    nav: ["首页", "漫剧库", "会员中心", "排行榜", "创作者计划", "关于我们"],
    navHrefs: ["/", "/series", "/membership", "/rankings", "/creator", "/about"],
    login: "登录",
    subscribe: "立即开通",
    heroTitle: "ZEN 漫剧宇宙",
    heroSubtitle: "AI 赋能，打造沉浸式高品质动态漫画世界",
    startWatching: "开始观看",
    browseSeries: "浏览作品",
    trailer: "观看精彩预告",
    featuredTitle: "精选漫剧",
    featuredSubtitle: "高能剧情，精彩不断",
    membershipTitle: "ZEN 会员特权",
    membershipSubtitle: "开通会员，解锁更多精彩体验",
    latestTitle: "最新更新",
    latestSubtitle: "追更不停，精彩连载中",
    rankingTitle: "本周热榜",
    rankingSubtitle: "正在被最多人追更的漫剧",
    creatorTitle: "创作者与 IP 合作",
    creatorSubtitle: "一起创造下一个爆款漫剧",
    footerRights: "© 2026 ZEN. All Rights Reserved."
  },
  en: {
    nav: ["Home", "Series", "Membership", "Rankings", "Creator Program", "About"],
    navHrefs: ["/", "/series", "/membership", "/rankings", "/creator", "/about"],
    login: "Log In",
    subscribe: "Join Now",
    heroTitle: "ZEN Motion Comics Universe",
    heroSubtitle: "AI-powered premium motion comics for immersive storytelling",
    startWatching: "Start Watching",
    browseSeries: "Browse Series",
    trailer: "Watch Trailer",
    featuredTitle: "Featured Series",
    featuredSubtitle: "Premium stories, updated continuously",
    membershipTitle: "ZEN Member Privileges",
    membershipSubtitle: "Unlock more premium motion comic experiences",
    latestTitle: "Latest Updates",
    latestSubtitle: "New episodes, continuous releases",
    rankingTitle: "Weekly Hotlist",
    rankingSubtitle: "The most-followed motion comics this week",
    creatorTitle: "Creator & IP Cooperation",
    creatorSubtitle: "Build the next breakout motion comic together",
    footerRights: "© 2026 ZEN. All Rights Reserved."
  }
} satisfies Record<Locale, Record<string, string | string[]>>;

export function t(locale: Locale) {
  return messages[locale];
}
