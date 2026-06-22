"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { getSeriesCategories, getSeriesTitle, latestUpdates } from "@/lib/mock-data";
import { usePublishedContent } from "@/hooks/usePublishedContent";

export function LatestUpdates() {
  const { locale } = useLanguage();
  const { series } = usePublishedContent();
  const items = latestUpdates.map((item) => ({ ...item, series: series.find((entry) => entry.slug === item.seriesSlug) })).filter((item) => item.series);

  return (
    <div className="updates-list rich-updates">
      {items.map((item) => {
        const series = item.series;
        if (!series) return null;
        const title = getSeriesTitle(series, locale);
        return (
          <Link href={`/watch/${series.slug}-ep-${item.episodeNumber}`} className="update-row" key={`${series.slug}-${item.episodeNumber}`}>
            <div className={`update-thumb poster-${series.slug}`}>
              <div className="mini-character" />
            </div>
            <div>
              <span className="new-tag">NEW · {locale === "zh" ? item.timeZh : item.timeEn}</span>
              <h3>{title} {locale === "zh" ? `第 ${item.episodeNumber} 话` : `EP ${item.episodeNumber}`}</h3>
              <p>{getSeriesCategories(series, locale).join(" / ")} · {series.badge}</p>
            </div>
            <span className="round-play"><Play size={15} fill="currentColor" /></span>
          </Link>
        );
      })}
    </div>
  );
}
