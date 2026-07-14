import { NextResponse } from "next/server";
import { createEpisode, listEpisodes } from "@/lib/db/episodes";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";
import { getSupabaseAdminState } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const state = getSupabaseAdminState();
  if (state.mode === "error") return NextResponse.json({ error: state.error }, { status: 500 });
  if (state.mode === "local") return NextResponse.json({ mode: "local", items: [], message: "Supabase is not configured." });
  try {
    return NextResponse.json({ mode: "supabase", items: await listEpisodes(state.client) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to list episodes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const state = getSupabaseAdminState();
  if (state.mode === "error") return NextResponse.json({ error: state.error }, { status: 500 });
  if (state.mode === "local") return NextResponse.json({ mode: "local", item: null, message: "Supabase is not configured." });
  try {
    const body = await request.json();
    return NextResponse.json({ mode: "supabase", item: await createEpisode(state.client, body) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create episode" }, { status: 500 });
  }
}
