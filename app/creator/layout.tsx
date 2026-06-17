import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "创作者计划 | ZEN 漫剧宇宙",
  description: "ZEN 支持原创 IP 孵化、漫剧定制、角色设定、分镜策划和 AI 动态漫画制作支持。"
};

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
