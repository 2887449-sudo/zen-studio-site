import type { SupabaseClient } from "@supabase/supabase-js";

export const IMAGE_BUCKETS = ["series-covers", "series-heroes", "episode-thumbnails", "hero-slides"] as const;
export type ImageBucket = typeof IMAGE_BUCKETS[number];

export function isImageBucket(value: string): value is ImageBucket {
  return IMAGE_BUCKETS.includes(value as ImageBucket);
}

export function isAllowedImage(file: File) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type) && file.size <= 10 * 1024 * 1024;
}

export async function uploadImage(client: SupabaseClient, bucket: ImageBucket, file: File) {
  const extension = file.name.split(".").pop() || "png";
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type
  });
  if (error) throw error;
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
