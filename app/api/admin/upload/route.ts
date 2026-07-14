import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/db/auth";
import { IMAGE_BUCKETS, isAllowedImage, isImageBucket, uploadImage } from "@/lib/db/storage";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

function safeImageName(name: string) {
  const extension = name.split(".").pop() || "png";
  return `${Date.now()}-${crypto.randomUUID()}.${extension.toLowerCase()}`;
}

async function saveLocalImage(file: File) {
  const fileName = safeImageName(file.name);
  const uploadDir = path.join(process.cwd(), "public", "uploads", "images");
  await mkdir(uploadDir, { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, fileName), Buffer.from(arrayBuffer));
  return `/uploads/images/${fileName}`;
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

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

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      const publicUrl = await saveLocalImage(file);
      return NextResponse.json({ mode: "local", publicUrl, message: "图片已保存到本地 public/uploads/images。" });
    }

    const publicUrl = await uploadImage(supabase, bucketValue, file);
    return NextResponse.json({ mode: "supabase", publicUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
