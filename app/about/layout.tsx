import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于我们 | ZEN 漫剧宇宙",
  description: "ZEN 是高端 AI 动态漫画平台，专注原创漫剧、沉浸式观看、会员内容和创作者合作。"
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
