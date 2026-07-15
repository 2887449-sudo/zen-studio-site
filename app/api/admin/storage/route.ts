import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";
import { getSupabaseAdminState } from "@/lib/supabase/admin";

const BUCKETS = [
  "series-covers",
  "series-heroes",
  "episode-thumbnails",
  "hero-slides",
  "episode-videos"
] as const;

type StorageItem = {
  bucket: string;
  name: string;
  path: string;
  publicUrl: string;
  createdAt: string;
  size: number;
  mimeType: string;
};

async function listBucket(client: NonNullable<ReturnType<typeof getSupabaseAdminState>["client"]>, bucket: string) {
  const items: StorageItem[] = [];

  async function visit(prefix = "") {
    const { data, error } = await client.storage.from(bucket).list(prefix, {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" }
    });
    if (error) throw error;

    for (const item of data ?? []) {
      const itemPath = prefix ? `${prefix}/${item.name}` : item.name;
      if (!item.id) {
        await visit(itemPath);
        continue;
      }
      const { data: publicData } = client.storage.from(bucket).getPublicUrl(itemPath);
      items.push({
        bucket,
        name: item.name,
        path: itemPath,
        publicUrl: publicData.publicUrl,
        createdAt: item.created_at || "",
        size: Number(item.metadata?.size) || 0,
        mimeType: String(item.metadata?.mimetype || "")
      });
    }
  }

  await visit();
  return items;
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const state = getSupabaseAdminState();
  if (state.mode === "error") return NextResponse.json({ error: state.error }, { status: 500 });
  if (state.mode === "local") {
    return NextResponse.json({ mode: "local", buckets: Object.fromEntries(BUCKETS.map((bucket) => [bucket, []])) });
  }

  try {
    const entries = await Promise.all(BUCKETS.map(async (bucket) => [bucket, await listBucket(state.client, bucket)] as const));
    return NextResponse.json({ mode: "supabase", buckets: Object.fromEntries(entries) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to list Storage files" }, { status: 500 });
  }
}
