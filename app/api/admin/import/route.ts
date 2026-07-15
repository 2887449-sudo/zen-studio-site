import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";
import type { CmsEpisode, CmsHeroSlide, CmsSeries } from "@/lib/cms-types";
import { createEpisode, listEpisodes, updateEpisode } from "@/lib/db/episodes";
import { createHeroSlide, listHeroSlides, updateHeroSlide } from "@/lib/db/hero-slides";
import { createSeries, listSeries, updateSeries } from "@/lib/db/series";
import { getSupabaseAdminState } from "@/lib/supabase/admin";

const LOCAL_ORIGINS = new Set(["http://localhost:3100", "http://127.0.0.1:3100"]);

function withCors(request: Request, response: NextResponse) {
  const origin = request.headers.get("origin") || "";
  if (LOCAL_ORIGINS.has(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Vary", "Origin");
  }
  return response;
}

export function OPTIONS(request: Request) {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, x-admin-password, Authorization");
  return withCors(request, response);
}

type ImportBody = {
  series?: CmsSeries[];
  episodes?: CmsEpisode[];
  heroSlides?: CmsHeroSlide[];
  conflictMode?: "overwrite" | "skip";
};

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return withCors(request, unauthorizedResponse());
  const state = getSupabaseAdminState();
  if (state.mode === "error") return withCors(request, NextResponse.json({ error: state.error }, { status: 500 }));
  if (state.mode === "local") {
    return withCors(request, NextResponse.json({ error: "Supabase is not configured on this server." }, { status: 500 }));
  }

  try {
    const body = await request.json() as ImportBody;
    const incomingSeries = Array.isArray(body.series) ? body.series : [];
    const incomingEpisodes = Array.isArray(body.episodes) ? body.episodes : [];
    const incomingHeroSlides = Array.isArray(body.heroSlides) ? body.heroSlides : [];
    const overwrite = body.conflictMode === "overwrite";
    const existingSeries = await listSeries(state.client);
    const seriesBySlug = new Map(existingSeries.map((item) => [item.slug, item]));
    const localToCloudSeriesId = new Map<string, string>();
    const summary = {
      seriesCreated: 0,
      seriesUpdated: 0,
      seriesSkipped: 0,
      episodesCreated: 0,
      episodesUpdated: 0,
      episodesSkipped: 0,
      heroCreated: 0,
      heroUpdated: 0,
      heroSkipped: 0
    };

    for (const item of incomingSeries) {
      if (!item.slug || !item.titleZh) continue;
      const existing = seriesBySlug.get(item.slug);
      if (existing) {
        localToCloudSeriesId.set(item.id, existing.id);
        if (overwrite) {
          const updated = await updateSeries(state.client, existing.id, { ...item, id: existing.id });
          seriesBySlug.set(updated.slug, updated);
          summary.seriesUpdated += 1;
        } else {
          summary.seriesSkipped += 1;
        }
        continue;
      }
      const created = await createSeries(state.client, item);
      localToCloudSeriesId.set(item.id, created.id);
      seriesBySlug.set(created.slug, created);
      summary.seriesCreated += 1;
    }

    const existingEpisodes = await listEpisodes(state.client);
    const episodeByKey = new Map(existingEpisodes.map((item) => [`${item.seriesId}:${item.episodeNumber}`, item]));
    for (const item of incomingEpisodes) {
      const cloudSeriesId = localToCloudSeriesId.get(item.seriesId)
        || existingSeries.find((series) => series.id === item.seriesId)?.id;
      if (!cloudSeriesId || !item.titleZh) continue;
      const key = `${cloudSeriesId}:${Number(item.episodeNumber) || 1}`;
      const existing = episodeByKey.get(key);
      const payload = { ...item, seriesId: cloudSeriesId };
      if (existing) {
        if (overwrite) {
          const updated = await updateEpisode(state.client, existing.id, payload);
          episodeByKey.set(key, updated);
          summary.episodesUpdated += 1;
        } else {
          summary.episodesSkipped += 1;
        }
        continue;
      }
      const created = await createEpisode(state.client, payload);
      episodeByKey.set(key, created);
      summary.episodesCreated += 1;
    }

    const existingHero = await listHeroSlides(state.client);
    const heroByKey = new Map(existingHero.map((item) => [`${item.seriesSlug || item.titleZh}:${item.sortOrder}`, item]));
    for (const item of incomingHeroSlides) {
      if (!item.titleZh) continue;
      const key = `${item.seriesSlug || item.titleZh}:${item.sortOrder}`;
      const existing = heroByKey.get(key);
      if (existing) {
        if (overwrite) {
          const updated = await updateHeroSlide(state.client, existing.id, item);
          heroByKey.set(key, updated);
          summary.heroUpdated += 1;
        } else {
          summary.heroSkipped += 1;
        }
        continue;
      }
      const created = await createHeroSlide(state.client, item);
      heroByKey.set(key, created);
      summary.heroCreated += 1;
    }

    return withCors(request, NextResponse.json({ mode: "supabase", summary }));
  } catch (error) {
    return withCors(request, NextResponse.json({ error: error instanceof Error ? error.message : "Import failed" }, { status: 500 }));
  }
}
