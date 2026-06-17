import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "排行榜 | ZEN 漫剧宇宙",
  description: "查看 ZEN 漫剧宇宙热播榜、新作榜、收藏榜和会员榜。"
};

export default function RankingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
