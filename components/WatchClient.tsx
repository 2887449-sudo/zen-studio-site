"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";
import { VideoPlayerMock } from "@/components/VideoPlayerMock";
import { VipLockOverlay } from "@/components/VipLockOverlay";
import { trackEvent } from "@/lib/analytics-events";
import { getEpisodeAccess, getEpisodeById, getSeriesById, getSeriesBySlug, getSeriesEpisodes } from "@/lib/mock-data";

type WatchClientProps = {
  episodeId: string;
};

function resolveEpisode(rawId: string) {
  const direct = getEpisodeById(rawId);
  if (direct) return direct;
  const parts = rawId.match(/(.+)-ep-(\d+)$/);
  if (!parts) return undefined;
  const series = getSeriesBySlug(parts[1]);
  if (!series) return undefined;
  return getEpisodeById(`${series.slug}-ep-${parts[2]}`);
}

export function WatchClient({ episodeId }: WatchClientProps) {
  const { locale } = useLanguage();
  const { showToast } = useToast();
  const episode = resolveEpisode(episodeId);
  const membershipMessage = locale === "zh" ? "会员系统即将开放，敬请期待。" : "Membership is coming soon. Stay tuned.";

  if (!episode) {
    return (
      <main className="page subpage">
        <section className="subpage-hero">
          <div className="container">
            <p className="eyebrow">NOT FOUND</p>
            <h1>{locale === "zh" ? "未找到剧集" : "Episode Not Found"}</h1>
            <p>{locale === "zh" ? "该剧集暂不存在或已下架。" : "This episode does not exist or is no longer available."}</p>
          </div>
        </section>
      </main>
    );
  }

  const series = getSeriesById(episode.seriesId);
  if (!series) {
    return (
      <main className="page subpage">
        <section className="subpage-hero">
          <div className="container">
            <p className="eyebrow">NOT FOUND</p>
            <h1>{locale === "zh" ? "未找到漫剧" : "Series Not Found"}</h1>
          </div>
        </section>
      </main>
    );
  }

  const access = getEpisodeAccess(episode);
  const locked = access === "vip";
  const title = `${locale === "zh" ? series.titleZh : series.titleEn} ${locale === "zh" ? episode.titleZh : episode.titleEn}`;
  const prevEpisode = episode.episodeNumber > 1 ? `${series.slug}-ep-${episode.episodeNumber - 1}` : `${series.slug}-ep-1`;
  const nextEpisode = `${series.slug}-ep-${Math.min(series.episodeCount, episode.episodeNumber + 1)}`;
  const episodeList = getSeriesEpisodes(series.id).slice(0, 8);

  return (
    <main className="page watch-page">
      <section className="watch-shell">
        <div className="container watch-layout">
          <div>
            <div className="watch-frame">
              <VideoPlayerMock title={title} access={access} locale={locale} onPlay={() => trackEvent("episode_play_click", {
                source: "watch_player",
                seriesId: series.id,
                slug: series.slug,
                episodeId: episode.id,
                episodeNumber: episode.episodeNumber,
                access
              })} />
              {locked ? <VipLockOverlay backHref={`/series/${series.slug}`} /> : null}
            </div>
            {access === "preview" ? (
              <div className="preview-notice">{locale === "zh" ? "试看 60 秒，开通会员观看完整版。" : "60-second preview. Join to watch the full episode."}</div>
            ) : null}
            {access === "free" ? (
              <div className="preview-notice">{locale === "zh" ? "正在播放免费剧集。" : "Playing a free episode."}</div>
            ) : null}
          </div>

          <aside className="watch-episode-panel">
            <p className="eyebrow">{locale === "zh" ? "剧集列表" : "Episodes"}</p>
            {episodeList.map((item) => {
              const itemAccess = getEpisodeAccess(item);
              return (
                <Link href={`/watch/${item.id}`} className={item.id === episode.id ? "active" : ""} key={item.id}>
                  <span>{locale === "zh" ? `第 ${item.episodeNumber} 话` : `EP ${item.episodeNumber}`}</span>
                  <b>{itemAccess === "free" ? (locale === "zh" ? "免费" : "Free") : itemAccess === "preview" ? (locale === "zh" ? "试看" : "Preview") : "VIP"}</b>
                </Link>
              );
            })}
          </aside>

          <div className="watch-meta">
            <div>
              <p className="eyebrow">NOW PLAYING</p>
              <h1>{title}</h1>
            </div>
            <div className="watch-actions">
              <Link href={`/watch/${prevEpisode}`} className="btn dark-outline"><ChevronLeft size={16} />{locale === "zh" ? "上一集" : "Previous"}</Link>
              <Link href={`/series/${series.slug}`} className="btn dark-outline">{locale === "zh" ? "返回详情" : "Back to Series"}</Link>
              <button type="button" className="btn primary" onClick={() => { trackEvent("vip_cta_click", { source: "watch_actions", seriesId: series.id, slug: series.slug, episodeId: episode.id, access }); showToast(membershipMessage); }}>{locale === "zh" ? "立即开通会员" : "Join Now"}</button>
              <Link href={`/watch/${nextEpisode}`} className="btn dark-outline">{locale === "zh" ? "下一集" : "Next"}<ChevronRight size={16} /></Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
