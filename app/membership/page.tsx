"use client";

import { Check, Crown, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";

const plans = [
  { zh: "免费用户", en: "Free", priceZh: "¥0", priceEn: "$0", perksZh: ["看预告", "第 1 话完整试看", "第 2 话 60 秒试看"], perksEn: ["Watch trailers", "Full episode 1", "60-second episode 2 preview"] },
  { zh: "ZEN 月度会员", en: "ZEN Monthly", priceZh: "¥18/月", priceEn: "$2.99/mo", perksZh: ["全集解锁", "抢先看", "高清观看", "会员番外"], perksEn: ["Full access", "Early access", "HD playback", "Member extras"], featured: true },
  { zh: "ZEN 年度会员", en: "ZEN Annual", priceZh: "¥168/年", priceEn: "$24.99/yr", perksZh: ["月度会员全部权益", "幕后花絮", "专属徽章", "下载权限"], perksEn: ["All monthly perks", "Behind scenes", "Exclusive badge", "Downloads"] }
];

const benefitsZh = ["全集解锁", "抢先看", "高清观看", "会员番外", "幕后花絮", "下载权限"];
const benefitsEn = ["Full Access", "Early Access", "HD Playback", "Member Extras", "Behind Scenes", "Downloads"];

export default function MembershipPage() {
  const { locale } = useLanguage();
  const { showToast } = useToast();
  const benefits = locale === "zh" ? benefitsZh : benefitsEn;

  function handlePaymentClick() {
    console.log("TODO: connect payment provider");
    showToast(locale === "zh" ? "会员系统即将开放，敬请期待。" : "Membership is coming soon. Stay tuned.");
  }

  return (
    <main className="page membership-page">
      <section className="member-hero">
        <div className="container member-hero-inner">
          <div>
            <p className="eyebrow">ZEN MEMBER</p>
            <h1>{locale === "zh" ? "ZEN会员" : "ZEN Membership"}</h1>
            <p>{locale === "zh" ? "解锁全集、抢先看、高清观看与会员番外。" : "Unlock full episodes, early access, HD playback, and member extras."}</p>
          </div>
          <div className="member-hero-card">
            <Sparkles size={22} />
            <strong>{locale === "zh" ? "付费观看体验即将开放" : "Premium viewing coming soon"}</strong>
            <span>{locale === "zh" ? "当前为上线前 mock 会员系统" : "Current version uses a mock membership flow"}</span>
          </div>
        </div>
      </section>

      <section className="section compact">
        <div className="container benefit-pills comparison-pills">
          {benefits.map((benefit) => <span key={benefit}>{benefit}</span>)}
        </div>
        <div className="container plan-grid">
          {plans.map((plan) => (
            <article className={`plan-card ${plan.featured ? "featured" : ""}`} key={plan.en}>
              {plan.featured ? <span className="badge"><Crown size={14} /> HOT</span> : null}
              <h2>{locale === "zh" ? plan.zh : plan.en}</h2>
              <strong>{locale === "zh" ? plan.priceZh : plan.priceEn}</strong>
              <ul>
                {(locale === "zh" ? plan.perksZh : plan.perksEn).map((perk) => (
                  <li key={perk}><Check size={16} />{perk}</li>
                ))}
              </ul>
              <button type="button" className="btn primary" onClick={handlePaymentClick}>
                {locale === "zh" ? "选择方案" : "Choose Plan"}
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
