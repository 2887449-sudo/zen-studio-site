import type { SupabaseClient } from "@supabase/supabase-js";
import type { CmsHeroSlide } from "@/lib/cms-types";
import { heroToRow, mapHeroRow } from "@/lib/db/mappers";

export async function listHeroSlides(client: SupabaseClient, activeOnly = false) {
  let query = client.from("hero_slides").select("*").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
  if (activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(mapHeroRow);
}

export async function getHeroSlide(client: SupabaseClient, id: string) {
  const { data, error } = await client.from("hero_slides").select("*").eq("id", id).single();
  if (error) throw error;
  return mapHeroRow(data);
}

export async function createHeroSlide(client: SupabaseClient, item: Partial<CmsHeroSlide>) {
  const { data, error } = await client.from("hero_slides").insert(heroToRow(item)).select("*").single();
  if (error) throw error;
  return mapHeroRow(data);
}

export async function updateHeroSlide(client: SupabaseClient, id: string, item: Partial<CmsHeroSlide>) {
  const { data, error } = await client.from("hero_slides").update(heroToRow(item)).eq("id", id).select("*").single();
  if (error) throw error;
  return mapHeroRow(data);
}

export async function deleteHeroSlide(client: SupabaseClient, id: string) {
  const { error } = await client.from("hero_slides").delete().eq("id", id);
  if (error) throw error;
}
