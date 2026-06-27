import type { SupabaseClient } from "@supabase/supabase-js";
import type { CmsSeries } from "@/lib/cms-types";
import { mapSeriesRow, seriesToRow } from "@/lib/db/mappers";

export async function listSeries(client: SupabaseClient, publishedOnly = false) {
  let query = client.from("series").select("*").order("sort_order", { ascending: true }).order("updated_at", { ascending: false });
  if (publishedOnly) query = query.eq("status", "published");
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapSeriesRow);
}

export async function getSeries(client: SupabaseClient, id: string) {
  const { data, error } = await client.from("series").select("*").eq("id", id).single();
  if (error) throw error;
  return mapSeriesRow(data);
}

export async function getSeriesBySlug(client: SupabaseClient, slug: string) {
  const { data, error } = await client.from("series").select("*").eq("slug", slug).single();
  if (error) throw error;
  return mapSeriesRow(data);
}

export async function createSeries(client: SupabaseClient, item: Partial<CmsSeries>) {
  const { data, error } = await client.from("series").insert(seriesToRow(item)).select("*").single();
  if (error) throw error;
  return mapSeriesRow(data);
}

export async function updateSeries(client: SupabaseClient, id: string, item: Partial<CmsSeries>) {
  const { data, error } = await client.from("series").update(seriesToRow(item)).eq("id", id).select("*").single();
  if (error) throw error;
  return mapSeriesRow(data);
}

export async function deleteSeries(client: SupabaseClient, id: string) {
  const { error } = await client.from("series").delete().eq("id", id);
  if (error) throw error;
}
