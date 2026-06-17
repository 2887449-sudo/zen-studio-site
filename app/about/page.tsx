"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

export default function AboutPage() {
  const { locale } = useLanguage();

  return (
    <main className="page about-page">
      <section className="subpage-hero dense-hero">
        <div className="container">
          <p className="eyebrow">ABOUT ZEN</p>
          <h1 className="about-title">{locale === "zh" ? "高端漫剧宇宙，而不是普通资源站" : "A Premium Motion Comics Universe"}</h1>
          <p>{locale === "zh" ? "ZEN 是一个 AI 动态漫画平台，专注原创漫剧、沉浸式观看、会员内容与创作者合作。" : "ZEN is an AI motion comics platform focused on original series, immersive viewing, member content, and creator cooperation."}</p>
        </div>
      </section>
      <section className="section compact">
        <div className="container vision-card">
          <p className="eyebrow">{locale === "zh" ? "平台愿景" : "Vision"}</p>
          <h2>{locale === "zh" ? "让原创故事以更快、更沉浸、更连续剧化的方式呈现。" : "Turning original stories into faster, more immersive episodic experiences."}</h2>
          <p>{locale === "zh" ? "ZEN 希望用 AI 视频化、动态分镜与漫画叙事能力，让创作者的故事从概念更快走向可观看、可追更、可会员付费的动态漫画作品。" : "ZEN combines AI video, motion paneling, and comic storytelling to help creators turn concepts into watchable, followable, membership-ready motion comics."}</p>
        </div>
        <div className="container about-grid enhanced-about-grid">
          <div className="about-card">
            <span>01</span>
            <h3>{locale === "zh" ? "原创漫剧" : "Original Series"}</h3>
            <p>{locale === "zh" ? "围绕校园、悬疑、科幻、都市、少女、热血等方向持续孵化原创内容。" : "Incubating original school, mystery, sci-fi, urban, girlhood, and action stories."}</p>
          </div>
          <div className="about-card">
            <span>02</span>
            <h3>{locale === "zh" ? "会员观看" : "Member Viewing"}</h3>
            <p>{locale === "zh" ? "提供免费试看、VIP 剧集、会员番外、高清观看和下载等扩展权益。" : "Offering previews, VIP episodes, member extras, HD viewing, and future downloads."}</p>
          </div>
          <div className="about-card">
            <span>03</span>
            <h3>{locale === "zh" ? "创作者合作" : "Creator Cooperation"}</h3>
            <p>{locale === "zh" ? "为原创 IP 提供漫剧化孵化、角色设定、分镜策划和上线推广支持。" : "Supporting original IP with adaptation, character design, storyboard planning, and launch promotion."}</p>
          </div>
        </div>
        <div className="container about-cta">
          <Link href="/series" className="btn primary">{locale === "zh" ? "进入漫剧库" : "Enter Series Library"}</Link>
          <Link href="/creator" className="btn dark-outline">{locale === "zh" ? "了解创作者计划" : "Creator Program"}</Link>
        </div>
      </section>
    </main>
  );
}
