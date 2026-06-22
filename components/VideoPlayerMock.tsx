"use client";

import { Play } from "lucide-react";
import type { EpisodeAccess, Locale } from "@/lib/mock-data";

type VideoPlayerMockProps = {
  title: string;
  access: EpisodeAccess;
  locale: Locale;
  onPlay?: () => void;
  videoUrl?: string;
};

export function VideoPlayerMock({ title, access, locale, onPlay, videoUrl }: VideoPlayerMockProps) {
  const status = access === "free"
    ? locale === "zh" ? "正在播放免费剧集" : "Playing a free episode"
    : access === "preview"
      ? locale === "zh" ? "试看 60 秒，开通会员观看完整版" : "60-second preview. Join to watch the full episode."
      : locale === "zh" ? "会员专享内容" : "Members-only content";

  return (
    <div className="video-player">
      <div className="player-topline">{title}</div>
      {videoUrl ? (
        <video className="player-video" src={videoUrl} controls preload="metadata" onPlay={onPlay} />
      ) : null}
      <button type="button" className="player-play" aria-label="Play" onClick={onPlay}>
        <Play size={34} fill="currentColor" />
      </button>
      <div className="player-caption">
        <strong>{title}</strong>
        <span>{videoUrl ? videoUrl : status}</span>
      </div>
    </div>
  );
}
