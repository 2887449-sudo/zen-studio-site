import { NextResponse } from "next/server";
import { createHeroSlide, listHeroSlides } from "@/lib/db/hero-slides";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";
import { getSupabaseAdminState } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const state = getSupabaseAdminState();
  if (state.mode === "error") return NextResponse.json({ error: state.error }, { status: 500 });
  if (state.mode === "local") return NextResponse.json({ mode: "local", items: [], message: "Supabase is not configured." });
  try {
    return NextResponse.json({ mode: "supabase", items: await listHeroSlides(state.client) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to list hero slides" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const state = getSupabaseAdminState();
  if (state.mode === "error") return NextResponse.json({ error: state.error }, { status: 500 });
  if (state.mode === "local") return NextResponse.json({ mode: "local", item: null, message: "Supabase is not configured." });
  try {
    const body = await request.json();
    return NextResponse.json({ mode: "supabase", item: await createHeroSlide(state.client, body) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create hero slide" }, { status: 500 });
  }
}
