import { NextResponse } from "next/server";
import { deleteSeries, getSeries, updateSeries } from "@/lib/db/series";
import { isAdminRequest, unauthorizedResponse } from "@/lib/db/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ mode: "local", item: null, message: "Supabase is not configured." });
  try {
    const { id } = await context.params;
    return NextResponse.json({ mode: "supabase", item: await getSeries(supabase, id) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to get series" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ mode: "local", item: null, message: "Supabase is not configured." }, { status: 503 });
  try {
    const { id } = await context.params;
    const body = await request.json();
    return NextResponse.json({ mode: "supabase", item: await updateSeries(supabase, id, body) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update series" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const supabase = getSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ mode: "local", message: "Supabase is not configured." }, { status: 503 });
  try {
    const { id } = await context.params;
    await deleteSeries(supabase, id);
    return NextResponse.json({ mode: "supabase", ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete series" }, { status: 500 });
  }
}
