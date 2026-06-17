"use client";

import Link from "next/link";
import { ArrowUpRight, Bot, Clapperboard, Contact, Megaphone, PenTool, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const icons = [Sparkles, Clapperboard, PenTool, Bot, Megaphone, Contact];

export function CreatorCooperation() {
  const { locale, copy } = useLanguage();
  const items = locale === "zh"
    ? ["原创 IP 孵化", "漫剧定制", "角色设定", "AI 动态漫画制作支持", "平台联合推广", "联系我们"]
    : ["Original IP Incubation", "Motion Comic Production", "Character Design", "AI Motion Comic Support", "Platform Co-Promotion", "Contact Us"];

  return (
    <section className="section">
      <div className="container">
        <div className="creator-band">
          <div>
            <p className="eyebrow">CREATOR PROGRAM</p>
            <h2>{copy.creatorTitle}</h2>
            <p>{copy.creatorSubtitle}</p>
            <Link href="/creator" className="line-action">
              {locale === "zh" ? "了解创作者计划" : "Explore the Creator Program"} <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="creator-grid">
            {items.map((item, index) => {
              const Icon = icons[index];
              return (
                <div className="creator-item" key={item}>
                  <Icon size={20} />
                  <span>{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
