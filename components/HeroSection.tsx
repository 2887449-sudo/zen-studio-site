"use client";

import Link from "next/link";
import { Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";
import { getSeriesCategories, getSeriesTitle, seriesList } from "@/lib/mock-data";

const heroSeries = seriesList[0];

export function HeroSection() {
  const { locale, copy } = useLanguage();
  const title = getSeriesTitle(heroSeries, locale);
  const tags = locale === "zh" ? ["原创漫剧", "会员追更", "高清动态漫画"] : ["Original Series", "Member Updates", "HD Motion Comics"];

  return (
    <section className="home-hero cinematic-hero">
      <div className="hero-comic-collage">
        <div className="comic-panel panel-one" />
        <div className="comic-panel panel-two" />
        <div className="comic-panel panel-three" />
        <div className="hero-character-silhouette" />
      </div>
      <div className="hero-noise" />
      <div className="container home-hero-inner">
        <div className="hero-copy">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            PREMIUM AI MOTION COMICS
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, delay: 0.1 }}>
            {copy.heroTitle}
          </motion.h1>
          <motion.p className="hero-lead" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.22 }}>
            {copy.heroSubtitle}
          </motion.p>
          <motion.div className="hero-tags" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.3 }}>
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </motion.div>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.38 }}>
            <Link href={`/watch/${heroSeries.slug}-ep-1`} className="btn primary">
              <Play size={16} fill="currentColor" />
              {copy.startWatching}
            </Link>
            <Link href="/series" className="btn outline">{copy.browseSeries}</Link>
          </motion.div>
        </div>
        <motion.div className="hero-feature-card" initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.72, delay: 0.25 }}>
          <div className={`poster-art poster-${heroSeries.slug} hero-poster-art`}>
            <div className="poster-grid-lines" />
            <div className="poster-character" />
            <div className="poster-film-strip" />
            <span className="badge">HOT</span>
            <span className="poster-title hero-poster-mark">ZEN ORIGINAL</span>
          </div>
          <div className="hero-feature-meta">
            <p className="eyebrow">{locale === "zh" ? "主推新作" : "Featured New Series"}</p>
            <h2>{title}</h2>
            <p className="feature-category">{getSeriesCategories(heroSeries, locale).join(" / ")}</p>
            <div>
              <span>{locale === "zh" ? "更新至第5话 · 第1话免费" : "Updated to EP5 · EP1 free"}</span>
            </div>
            <Link href={`/watch/${heroSeries.slug}-ep-1`} className="hero-play-link">
              <Play size={16} fill="currentColor" />
              {locale === "zh" ? "立即观看" : "Watch Now"}
            </Link>
          </div>
        </motion.div>
      </div>
      <div className="hero-status">
        <Sparkles size={15} />
        {locale === "zh" ? "原创漫剧持续上新" : "Original series updated weekly"}
      </div>
    </section>
  );
}
