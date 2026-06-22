"use client";

import { useEffect, useState } from "react";
import { getPublishedContent } from "@/lib/content-storage";
import { episodes as mockEpisodes, seriesList as mockSeriesList, type Episode, type Series } from "@/lib/mock-data";

type PublishedContent = {
  series: Series[];
  episodes: Episode[];
};

export function usePublishedContent(): PublishedContent {
  const [content, setContent] = useState<PublishedContent>({ series: mockSeriesList, episodes: mockEpisodes });

  useEffect(() => {
    const refresh = () => setContent(getPublishedContent());
    refresh();
    window.addEventListener("storage", refresh);
    window.addEventListener("zen-content-change", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("zen-content-change", refresh);
    };
  }, []);

  return content;
}
