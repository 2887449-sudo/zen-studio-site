"use client";

import Link from "next/link";
import { Flame, UsersRound } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { formatNumber, getSeriesBySlug, getSeriesCategories, getSeriesTitle, rankingSeries } from "@/lib/mock-data";

export function RankingPanel() {
  const { locale } = useLanguage();
  const series = rankingSeries.map(getSeriesBySlug).filter((item) => item !== undefined);
  const maxFollowers = Math.max(...series.map((item) => item.followers));

  return (
    <div className="ranking-panel rich-ranking">
      {series.map((item, index) => {
        const heat = Math.max(24, Math.round((item.followers / maxFollowers) * 100));
        return (
          <Link href={`/series/${item.slug}`} className={`ranking-row ${index === 0 ? "top-one" : ""}`} key={item.id}>
            <strong>TOP {index + 1}</strong>
            <span>
              <b>{getSeriesTitle(item, locale)}</b>
              <small>{getSeriesCategories(item, locale).join(" / ")} · {locale === "zh" ? `更新至第 ${item.episodeCount} 话` : `${item.episodeCount} episodes`}</small>
              <i style={{ ["--heat" as string]: `${heat}%` }} />
            </span>
            <em><Flame size={14} /> {formatNumber(item.views, locale)}</em>
            <em><UsersRound size={14} /> {formatNumber(item.followers, locale)}</em>
          </Link>
        );
      })}
    </div>
  );
}
