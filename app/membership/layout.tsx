import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "会员中心 | ZEN 漫剧宇宙",
  description: "开通 ZEN 会员，解锁全集观看、抢先看、高清播放、会员番外、幕后花絮与下载权限。"
};

export default function MembershipLayout({ children }: { children: React.ReactNode }) {
  return children;
}
