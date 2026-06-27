import type { SupabaseClient } from "@supabase/supabase-js";
import type { CmsEpisode } from "@/lib/cms-types";
import { episodeToRow, mapEpisodeRow } from "@/lib/db/mappers";

export async function listEpisodes(client: SupabaseClient, filters?: { publishedOnly?: boolean; seriesId?: string }) {
  let query = client.from("episodes").select("*").order("sort_order", { ascending: true }).order("episode_number", { ascending: true });
  if (filters?.publishedOnly) query = query.eq("status", "published");
  if (filters?.seriesId) query = query.eq("series_id", filters.seriesId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapEpisodeRow);
}

export async function getEpisode(client: SupabaseClient, id: string) {
  const { data, error } = await client.from("episodes").select("*").eq("id", id).single();
  if (error) throw error;
  return mapEpisodeRow(data);
}

export async function createEpisode(client: SupabaseClient, item: Partial<CmsEpisode>) {
  const { data, error } = await client.from("episodes").insert(episodeToRow(item)).select("*").single();
  if (error) throw error;
  return mapEpisodeRow(data);
}

export async function updateEpisode(client: SupabaseClient, id: string, item: Partial<CmsEpisode>) {
  const { data, error } = await client.from("episodes").update(episodeToRow(item)).eq("id", id).select("*").single();
  if (error) throw error;
  return mapEpisodeRow(data);
}

export async function deleteEpisode(client: SupabaseClient, id: string) {
  const { error } = await client.from("episodes").delete().eq("id", id);
  if (error) throw error;
}
