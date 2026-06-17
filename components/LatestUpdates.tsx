"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { getSeriesBySlug, getSeriesCategories, getSeriesTitle, latestUpdates } from "@/lib/mock-data";

export function LatestUpdates() {
  const { locale } = useLanguage();
  const items = latestUpdates.map((item) => ({ ...item, series: getSeriesBySlug(item.seriesSlug) })).filter((item) => item.series);

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
