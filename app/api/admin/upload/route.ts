import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/db/auth";
import { IMAGE_BUCKETS, isAllowedImage, isImageBucket, uploadImage } from "@/lib/db/storage";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json({ mode: "local", error: "Supabase Storage is not configured. Use URL input fallback." }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const bucketValue = String(formData.get("bucket") || "");
    const file = formData.get("file");
    if (!isImageBucket(bucketValue)) {
      return NextResponse.json({ error: `Invalid bucket. Use one of: ${IMAGE_BUCKETS.join(", ")}` }, { status: 400 });
    }
    if (!(file instanceof File) || !isAllowedImage(file)) {
      return NextResponse.json({ error: "Only jpg, jpeg, png, webp images up to 10MB are allowed." }, { status: 400 });
    }
    const publicUrl = await uploadImage(supabase, bucketValue, file);
    return NextResponse.json({ mode: "supabase", publicUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
