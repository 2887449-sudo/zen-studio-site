"use client";

import Link from "next/link";
import { Eye, Play, UsersRound } from "lucide-react";
import { motion } from "framer-motion";
import type { Locale, Series } from "@/lib/mock-data";
import { formatNumber, getSeriesCategories, getSeriesTitle } from "@/lib/mock-data";

type SeriesCardProps = {
  series: Series;
  locale: Locale;
  featured?: boolean;
};

export function SeriesCard({ series, locale, featured = false }: SeriesCardProps) {
  const title = getSeriesTitle(series, locale);
  const categories = getSeriesCategories(series, locale);
  const isUpcoming = series.status === "upcoming";
  const href = isUpcoming ? "/series" : `/series/${series.slug}`;

  return (
    <motion.article className={`series-card premium-card ${featured ? "featured-card" : ""} ${isUpcoming ? "upcoming-card" : ""}`} whileHover={{ y: -6 }}>
      <Link href={href}>
        <div className={`poster-art poster-${series.slug}`}>
          <div className="poster-grid-lines" />
          <div className="poster-character" />
          <div className="poster-film-strip" />
          <span className="badge">{isUpcoming ? (locale === "zh" ? "即将上线" : "Coming Soon") : series.badge}</span>
          <span className="poster-title">{title}</span>
          <span className="poster-subtitle">{categories.join(" / ")}</span>
          {!isUpcoming ? (
            <span className="play-chip" aria-hidden="true">
              <Play size={16} fill="currentColor" />
            </span>
          ) : null}
        </div>
        <div className="series-card-body">
          <h3>{title}</h3>
          <p>{categories.join(" / ")}</p>
          <div className="series-status-line">
            <span>{isUpcoming ? (locale === "zh" ? "即将上线" : "Coming soon") : locale === "zh" ? `更新至第 ${series.episodeCount} 话` : `${series.episodeCount} episodes`}</span>
            <span>{series.slug === "xiaoxi-campus-diary" ? (locale === "zh" ? "第1话免费试看" : "EP1 free") : series.isVip ? "VIP" : locale === "zh" ? "免费试看" : "Free preview"}</span>
          </div>
          <div className="series-metrics">
            <span><Eye size={14} />{formatNumber(series.views, locale)}</span>
            <span><UsersRound size={14} />{formatNumber(series.followers, locale)}</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
