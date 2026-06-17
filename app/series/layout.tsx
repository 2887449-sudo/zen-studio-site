import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "漫剧库 | ZEN 漫剧宇宙",
  description: "浏览 ZEN 漫剧宇宙原创 AI 动态漫画，支持分类、VIP 与更新状态筛选。Premium AI-powered motion comics platform."
};

export default function SeriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
