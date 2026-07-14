"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { SafeImage } from "@/components/SafeImage";
import { useLanguage } from "@/components/LanguageProvider";
import { trackEvent } from "@/lib/analytics-events";
import { usePublishedContent } from "@/hooks/usePublishedContent";

type HeroSlide = {
  titleZh: string;
  titleEn: string;
  subtitleZh: string;
  subtitleEn: string;
  badgeZh: string;
  badgeEn: string;
  episodeInfoZh: string;
  episodeInfoEn: string;
  image: string;
  slug: string;
  categoryZh: string;
  categoryEn: string;
};

function cleanTitle(value: string) {
  return value.replace("小汐的校园显眼包日记", "小汐的日记");
}

const defaultHeroSlides: HeroSlide[] = [
  {
    titleZh: "小汐的日记",
    titleEn: "Xiaoxi's Diary",
    subtitleZh: "古灵精怪的小汐，把校园日常过成爆笑冒险。",
    subtitleEn: "A mischievous school-day comedy where everyday campus life turns into a bright, chaotic adventure.",
    badgeZh: "主推新作",
    badgeEn: "Featured New Series",
    episodeInfoZh: "更新至第5话 · 第1话免费",
    episodeInfoEn: "Updated to EP5 · EP1 free",
    image: "/images/hero/hero-xiaoxi.jpg",
    slug: "xiaoxi-campus-diary",
    categoryZh: "校园 / 搞笑 / 日常",
    categoryEn: "School / Comedy / Daily Life"
  },
  {
    titleZh: "仙境战士群像",
    titleEn: "Xianxia Heroes",
    subtitleZh: "热血、宿命与仙途交织，开启恢弘东方幻想篇章。",
    subtitleEn: "Heroic destinies and immortal paths collide in an expansive Eastern fantasy saga.",
    badgeZh: "东方仙侠",
    badgeEn: "Eastern Xianxia",
    episodeInfoZh: "全新上线 · 群像冒险",
    episodeInfoEn: "New arrival · Ensemble adventure",
    image: "/images/hero/hero-xianxia.jpg",
    slug: "xianxia-heroes",
    categoryZh: "仙侠 / 热血 / 群像",
    categoryEn: "Xianxia / Action / Ensemble"
  },
  {
    titleZh: "雨夜调查",
    titleEn: "Rainy Night Investigation",
    subtitleZh: "在城市暗角追踪真相，每一步都逼近更深的谜团。",
    subtitleEn: "Truth hides in the city's dark corners, and every step leads deeper into the case.",
    badgeZh: "悬疑追踪",
    badgeEn: "Mystery Chase",
    episodeInfoZh: "高能连载 · 夜色谜案",
    episodeInfoEn: "High-tension serial · Night case",
    image: "/images/hero/hero-suspense.jpg",
    slug: "rainy-night-investigation",
    categoryZh: "悬疑 / 都市 / 调查",
    categoryEn: "Mystery / Urban / Investigation"
  },
  {
    titleZh: "都市夜行者",
    titleEn: "Urban Nights",
    subtitleZh: "灯火与欲望之间，一群年轻人在都市命运中并肩前行。",
    subtitleEn: "Between city lights and restless desire, young lives move together through urban fate.",
    badgeZh: "都市群像",
    badgeEn: "Urban Ensemble",
    episodeInfoZh: "都市新作 · 人物群像",
    episodeInfoEn: "Urban new series · Ensemble cast",
    image: "/images/hero/hero-urban.jpg",
    slug: "urban-nights",
    categoryZh: "都市 / 青春 / 群像",
    categoryEn: "Urban / Youth / Ensemble"
  }
];

function getWatchHref(slug: string) {
  return slug === "xiaoxi-campus-diary" ? "/watch/xiaoxi-campus-diary-ep-1" : "/series";
}

export function HeroSection() {
  const { locale, copy } = useLanguage();
  const { heroSlides: cmsHeroSlides } = usePublishedContent();
  const heroSlides = useMemo(() => cmsHeroSlides.length ? cmsHeroSlides.map((slide) => ({
    titleZh: slide.titleZh,
    titleEn: slide.titleEn || slide.titleZh,
    subtitleZh: slide.subtitleZh || "",
    subtitleEn: slide.subtitleEn || slide.subtitleZh || "",
    badgeZh: slide.badgeZh || "主推新作",
    badgeEn: slide.badgeEn || slide.badgeZh || "Featured",
    episodeInfoZh: slide.episodeInfoZh || "",
    episodeInfoEn: slide.episodeInfoEn || slide.episodeInfoZh || "",
    image: slide.imageUrl || "/images/hero/hero-xiaoxi.jpg",
    slug: slide.seriesSlug || "xiaoxi-campus-diary",
    categoryZh: slide.badgeZh || "原创漫剧",
    categoryEn: slide.badgeEn || "Original Series"
  })) : defaultHeroSlides, [cmsHeroSlides]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const activeSlide = heroSlides[activeIndex] ?? heroSlides[0];
  const tags = locale === "zh" ? ["原创漫剧", "会员追更", "高清动态漫画"] : ["Original Series", "Member Updates", "HD Motion Comics"];
  const localized = useMemo(() => ({
    title: cleanTitle(locale === "zh" ? activeSlide.titleZh : activeSlide.titleEn),
    subtitle: locale === "zh" ? activeSlide.subtitleZh : activeSlide.subtitleEn,
    badge: locale === "zh" ? activeSlide.badgeZh : activeSlide.badgeEn,
    episodeInfo: locale === "zh" ? activeSlide.episodeInfoZh : activeSlide.episodeInfoEn,
    category: locale === "zh" ? activeSlide.categoryZh : activeSlide.categoryEn
  }), [activeSlide, locale]);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [heroSlides.length, paused]);

  useEffect(() => {
    setActiveIndex(0);
  }, [heroSlides.length]);

  useEffect(() => {
    trackEvent("hero_view", {
      slug: activeSlide.slug,
      title: localized.title,
      index: activeIndex
    });
  }, [activeIndex, activeSlide.slug, localized.title]);

  const goToSlide = (index: number, action: "arrow" | "dot") => {
    const nextIndex = (index + heroSlides.length) % heroSlides.length;
    const nextSlide = heroSlides[nextIndex];
    trackEvent("hero_click", {
      action,
      slug: nextSlide.slug,
      title: locale === "zh" ? nextSlide.titleZh : nextSlide.titleEn,
      index: nextIndex
    });
    setActiveIndex(nextIndex);
  };
  const watchHref = getWatchHref(activeSlide.slug);
  const trackHeroCta = () => {
    trackEvent("hero_click", {
      action: "cta",
      slug: activeSlide.slug,
      title: localized.title
    });
  };

  return (
    <section className="home-hero cinematic-hero hero-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <AnimatePresence>
        <motion.div
          key={activeSlide.image}
          className="hero-bg-slide"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          <SafeImage
            src={activeSlide.image}
            alt={localized.title}
            fill
            priority={activeIndex === 0}
            sizes="100vw"
            className="hero-bg-image"
            fallbackLabel="ZEN"
          />
        </motion.div>
      </AnimatePresence>
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
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <h1>{locale === "zh" ? "ZEN 漫剧宇宙" : copy.heroTitle}</h1>
              <p className="hero-lead">{localized.subtitle}</p>
            </motion.div>
          </AnimatePresence>
          <motion.div className="hero-tags" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.12 }}>
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </motion.div>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.18 }}>
            <Link href={watchHref} className="btn primary" onClick={trackHeroCta}>
              <Play size={16} fill="currentColor" />
              {copy.startWatching}
            </Link>
            <Link href="/series" className="btn outline">{copy.browseSeries}</Link>
          </motion.div>
        </div>
        <motion.div className="hero-feature-card hero-slide-card" initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.72, delay: 0.18 }}>
          <div className="hero-poster-art hero-visual-poster">
            <SafeImage
              src={activeSlide.image}
              alt={localized.title}
              fill
              priority={activeIndex === 0}
              sizes="(max-width: 980px) 360px, 360px"
              className="hero-poster-image"
              fallbackLabel={localized.title}
            />
            <div className="poster-grid-lines" />
            <span className="badge">{localized.badge}</span>
            <span className="poster-title hero-poster-mark">ZEN ORIGINAL</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeSlide.slug}-meta`}
              className="hero-feature-meta"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <p className="eyebrow">{localized.badge}</p>
              <h2>{localized.title}</h2>
              <p className="feature-category">{localized.category}</p>
              <div>
                <span>{localized.episodeInfo}</span>
              </div>
              <Link href={watchHref} className="hero-play-link" onClick={trackHeroCta}>
                <Play size={16} fill="currentColor" />
                {locale === "zh" ? "立即观看" : "Watch Now"}
              </Link>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      <button className="hero-arrow hero-arrow-prev" type="button" aria-label="Previous hero" onClick={() => goToSlide(activeIndex - 1, "arrow")}>
        <ChevronLeft size={22} />
      </button>
      <button className="hero-arrow hero-arrow-next" type="button" aria-label="Next hero" onClick={() => goToSlide(activeIndex + 1, "arrow")}>
        <ChevronRight size={22} />
      </button>
      <div className="hero-dots" aria-label="Hero slides">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.slug}
            type="button"
            className={index === activeIndex ? "active" : ""}
            aria-label={`Show ${locale === "zh" ? slide.titleZh : slide.titleEn}`}
            onClick={() => goToSlide(index, "dot")}
          />
        ))}
      </div>
      <div className="hero-status">
        <Sparkles size={15} />
        {locale === "zh" ? "原创漫剧持续上新" : "Original series updated weekly"}
      </div>
    </section>
  );
}
