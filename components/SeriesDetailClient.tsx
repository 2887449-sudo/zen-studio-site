"use client";

import Link from "next/link";
import { Heart, LockKeyhole, Play } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { trackEvent } from "@/lib/analytics-events";
import { formatNumber, getEpisodeAccess, getSeriesBySlug, getSeriesCategories, getSeriesDescription, getSeriesEpisodes, getSeriesTitle } from "@/lib/mock-data";

type SeriesDetailClientProps = {
  slug: string;
};

export function SeriesDetailClient({ slug }: SeriesDetailClientProps) {
  const { locale } = useLanguage();
  const series = getSeriesBySlug(slug);

  if (!series) {
    return (
      <main className="page subpage">
        <section className="subpage-hero">
          <div className="container">
            <p className="eyebrow">NOT FOUND</p>
            <h1>{locale === "zh" ? "未找到漫剧" : "Series Not Found"}</h1>
            <p>{locale === "zh" ? "该作品暂不存在或已下架。" : "This series does not exist or is no longer available."}</p>
          </div>
        </section>
      </main>
    );
  }

  const episodes = getSeriesEpisodes(series.id);
  const title = getSeriesTitle(series, locale);
  const categories = getSeriesCategories(series, locale);

  return (
    <main className="page detail-page">
      <section className={`detail-hero detail-poster-bg poster-${series.slug}`}>
        <div className="container detail-hero-inner">
          <div className="detail-poster poster-art">
            <div className="poster-grid-lines" />
            <div className="poster-character" />
            <div className="poster-film-strip" />
            <span className="badge">{series.badge}</span>
            <span className="poster-title">{title}</span>
            <span className="poster-subtitle">{categories.join(" / ")}</span>
          </div>
          <div>
            <p className="eyebrow">{series.badge}</p>
            <h1>{title}</h1>
            <p>{getSeriesDescription(series, locale)}</p>
            <div className="tag-row">
              {categories.map((item) => <span key={item}>{item}</span>)}
              <span>{series.status === "upcoming" ? (locale === "zh" ? "即将上线" : "Coming soon") : locale === "zh" ? `更新至第 ${series.episodeCount} 话` : `${series.episodeCount} episodes`}</span>
              <span>{series.isVip ? "VIP" : locale === "zh" ? "免费试看" : "Free preview"}</span>
            </div>
            <div className="hero-actions">
              <Link href={series.status === "upcoming" ? "/series" : `/watch/${series.slug}-ep-1`} className="btn primary" onClick={() => trackEvent("episode_play_click", { source: "series_detail_start", seriesId: series.id, slug: series.slug, title })}><Play size={16} fill="currentColor" />{locale === "zh" ? "开始观看" : "Start Watching"}</Link>
              <button type="button" className="btn dark-outline" onClick={() => trackEvent("favorite_click", { seriesId: series.id, slug: series.slug, title })}><Heart size={16} />{locale === "zh" ? "收藏" : "Save"}</button>
            </div>
            <p className="small-meta">{formatNumber(series.views, locale)} {locale === "zh" ? "播放" : "views"} / {formatNumber(series.followers, locale)} {locale === "zh" ? "追更" : "followers"}</p>
          </div>
        </div>
      </section>
      <section className="section compact">
        <div className="container">
          <h2 className="block-heading">{locale === "zh" ? "剧集列表" : "Episodes"}</h2>
          {episodes.length ? (
            <div className="episode-list">
              {episodes.map((episode) => {
                const access = getEpisodeAccess(episode);
                const status = access === "free"
                  ? locale === "zh" ? "免费" : "Free"
                  : access === "preview"
                    ? locale === "zh" ? "试看" : "Preview"
                    : locale === "zh" ? "会员专享" : "Members";
                return (
                  <Link href={`/watch/${episode.id}`} className="episode-row" key={episode.id}>
                    <span>{locale === "zh" ? `第 ${episode.episodeNumber} 话` : `Episode ${episode.episodeNumber}`}</span>
                    <strong>{locale === "zh" ? episode.titleZh : episode.titleEn}</strong>
                    <em>{episode.duration}</em>
                    <b>{access === "vip" ? <><LockKeyhole size={14} /> {status}</> : status}</b>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">{locale === "zh" ? "作品即将上线，欢迎先收藏追更。" : "Coming soon. Save it and follow the launch."}</div>
          )}
        </div>
      </section>
    </main>
  );
}
