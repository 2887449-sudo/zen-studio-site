"use client";

import { useEffect, useState } from "react";
import { cmsEpisodeToEpisode, cmsSeriesToSeries, getPublishedContent, type ManagedEpisode, type ManagedHeroSlide, type ManagedSeries } from "@/lib/content-storage";
import { episodes as mockEpisodes, seriesList as mockSeriesList, type Episode, type Series } from "@/lib/mock-data";

type PublishedContent = {
  series: Series[];
  episodes: Episode[];
  heroSlides: ManagedHeroSlide[];
  mode: "supabase" | "local";
};

export function usePublishedContent(): PublishedContent {
  const [content, setContent] = useState<PublishedContent>({ series: mockSeriesList, episodes: mockEpisodes, heroSlides: [], mode: "local" });

  useEffect(() => {
    const refreshLocal = () => {
      const local = getPublishedContent();
      setContent({ ...local, mode: "local" });
    };

    const refresh = async () => {
      refreshLocal();
      try {
        const response = await fetch("/api/content", { cache: "no-store" });
        const data = await response.json() as { mode: "supabase" | "local"; series: ManagedSeries[]; episodes: ManagedEpisode[]; heroSlides: ManagedHeroSlide[] };
        if (data.mode === "supabase") {
          setContent({
            mode: "supabase",
            series: data.series.map(cmsSeriesToSeries),
            episodes: data.episodes.map(cmsEpisodeToEpisode),
            heroSlides: data.heroSlides
          });
        }
      } catch {
        refreshLocal();
      }
    };

    void refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("zen-content-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("zen-content-change", refresh);
    };
  }, []);

  return content;
}
