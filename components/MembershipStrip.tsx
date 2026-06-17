"use client";

import { BadgeCheck, Download, Eye, LockKeyhole, Sparkles, Tv } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics-events";

const benefitIcons = [LockKeyhole, Eye, Tv, BadgeCheck, Sparkles, Download];

export function MembershipStrip() {
  const { locale, copy } = useLanguage();
  const { showToast } = useToast();
  const membershipMessage = locale === "zh" ? "会员系统即将开放，敬请期待。" : "Membership is coming soon. Stay tuned.";
  const benefits = locale === "zh"
    ? ["全集解锁", "抢先看", "高清观看", "会员番外", "幕后花絮", "下载权限"]
    : ["Full Access", "Early Access", "HD Playback", "Member Extras", "Behind Scenes", "Downloads"];

  return (
    <section className="section compact">
      <div className="container membership-strip">
        <div className="membership-card">
          <p className="eyebrow">ZEN MEMBER</p>
          <h2>{copy.membershipTitle}</h2>
          <p>{copy.membershipSubtitle}</p>
          <button type="button" className="btn primary" onClick={() => { trackEvent("vip_cta_click", { source: "membership_strip" }); showToast(membershipMessage); }}>{copy.subscribe}</button>
        </div>
        <div className="benefit-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefitIcons[index];
            return (
              <div key={benefit} className="benefit-item">
                <Icon size={20} />
                <span>{benefit}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
