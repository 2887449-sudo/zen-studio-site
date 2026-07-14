"use client";

import { useRef, useState } from "react";
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const status = access === "free"
    ? locale === "zh" ? "正在播放免费剧集" : "Playing a free episode"
    : access === "preview"
      ? locale === "zh" ? "试看 60 秒，开通会员观看完整版" : "60-second preview. Join to watch the full episode."
      : locale === "zh" ? "会员专享内容" : "Members-only content";

  function handlePlayClick() {
    if (videoRef.current) {
      void videoRef.current.play();
    }
  }

  return (
    <div className="video-player">
      <div className="player-topline">{title}</div>
      {videoUrl ? (
        <video
          ref={videoRef}
          className="player-video"
          src={videoUrl}
          controls
          preload="metadata"
          onPlay={() => {
            setIsPlaying(true);
            onPlay?.();
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      ) : null}
      {!isPlaying ? (
        <button type="button" className="player-play" aria-label="Play" onClick={handlePlayClick}>
          <Play size={34} fill="currentColor" />
        </button>
      ) : null}
      <div className="player-caption">
        <strong>{title}</strong>
        <span>{videoUrl ? videoUrl : status}</span>
      </div>
    </div>
  );
}
