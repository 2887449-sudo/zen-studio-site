import { NextResponse } from "next/server";
import { deleteSeries, getSeries, updateSeries } from "@/lib/db/series";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";
import { getSupabaseAdminState } from "@/lib/supabase/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const state = getSupabaseAdminState();
  if (state.mode === "error") return NextResponse.json({ error: state.error }, { status: 500 });
  if (state.mode === "local") return NextResponse.json({ mode: "local", item: null, message: "Supabase is not configured." });
  try {
    const { id } = await context.params;
    return NextResponse.json({ mode: "supabase", item: await getSeries(state.client, id) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to get series" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const state = getSupabaseAdminState();
  if (state.mode === "error") return NextResponse.json({ error: state.error }, { status: 500 });
  if (state.mode === "local") return NextResponse.json({ mode: "local", item: null, message: "Supabase is not configured." });
  try {
    const { id } = await context.params;
    const body = await request.json();
    return NextResponse.json({ mode: "supabase", item: await updateSeries(state.client, id, body) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update series" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const state = getSupabaseAdminState();
  if (state.mode === "error") return NextResponse.json({ error: state.error }, { status: 500 });
  if (state.mode === "local") return NextResponse.json({ mode: "local", message: "Supabase is not configured." });
  try {
    const { id } = await context.params;
    await deleteSeries(state.client, id);
    return NextResponse.json({ mode: "supabase", ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to delete series" }, { status: 500 });
  }
}
