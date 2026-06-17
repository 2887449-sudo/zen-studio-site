import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "漫剧详情 | ZEN 漫剧宇宙",
  description: "查看 ZEN 原创漫剧详情、剧集列表、免费试看与会员专享内容。"
};

export default function SeriesDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
