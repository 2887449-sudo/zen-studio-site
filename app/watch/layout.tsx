import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "播放 | ZEN 漫剧宇宙",
  description: "观看 ZEN 漫剧宇宙动态漫画剧集，包含免费试看、60 秒试看和会员锁定体验。"
};

export default function WatchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
