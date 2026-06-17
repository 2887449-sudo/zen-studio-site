"use client";

import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";

type VipLockOverlayProps = {
  backHref: string;
};

export function VipLockOverlay({ backHref }: VipLockOverlayProps) {
  const { locale } = useLanguage();
  const { showToast } = useToast();
  const membershipMessage = locale === "zh" ? "会员系统即将开放，敬请期待。" : "Membership is coming soon. Stay tuned.";

  return (
    <div className="vip-overlay">
      <LockKeyhole size={34} />
      <h2>{locale === "zh" ? "本集为 ZEN 会员专享" : "This episode is exclusive to ZEN members"}</h2>
      <p>{locale === "zh" ? "开通会员后观看完整内容" : "Join to unlock the full episode"}</p>
      <div className="overlay-actions">
        <button type="button" className="btn primary" onClick={() => showToast(membershipMessage)}>{locale === "zh" ? "立即开通会员" : "Join Now"}</button>
        <Link href={backHref} className="btn outline">{locale === "zh" ? "返回剧集列表" : "Back to Episodes"}</Link>
      </div>
    </div>
  );
}
