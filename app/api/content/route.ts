import { NextResponse } from "next/server";
import { listEpisodes } from "@/lib/db/episodes";
import { listHeroSlides } from "@/lib/db/hero-slides";
import { listSeries } from "@/lib/db/series";
import { getServerSupabaseClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getServerSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ mode: "local", series: [], episodes: [], heroSlides: [] });
  }

  try {
    const [series, episodes, heroSlides] = await Promise.all([
      listSeries(supabase, true),
      listEpisodes(supabase, { publishedOnly: true }),
      listHeroSlides(supabase, true)
    ]);
    return NextResponse.json({ mode: "supabase", series, episodes, heroSlides });
  } catch (error) {
    return NextResponse.json({ mode: "local", series: [], episodes: [], heroSlides: [], message: error instanceof Error ? error.message : "Supabase read failed" });
  }
}
