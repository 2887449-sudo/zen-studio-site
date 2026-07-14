import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";
import { isAllowedImage, uploadImage } from "@/lib/db/storage";
import { getSupabaseAdminState } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const BUCKET_BY_UPLOAD_TYPE = {
  "series-cover": "series-covers",
  "series-hero": "series-heroes",
  "episode-thumbnail": "episode-thumbnails",
  "hero-slide": "hero-slides"
} as const;

type UploadType = keyof typeof BUCKET_BY_UPLOAD_TYPE;

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
    const uploadType = String(formData.get("type") || "") as UploadType;
    const bucket = BUCKET_BY_UPLOAD_TYPE[uploadType];
    const file = formData.get("file");
    if (!bucket) {
      return NextResponse.json({ error: "Invalid upload type" }, { status: 400 });
    }
    if (!(file instanceof File) || !isAllowedImage(file)) {
      return NextResponse.json({ error: "Only jpg, jpeg, png, webp images up to 10MB are allowed." }, { status: 400 });
    }

    const state = getSupabaseAdminState();
    if (state.mode === "error") return NextResponse.json({ error: state.error }, { status: 500 });
    if (state.mode === "local") {
      const publicUrl = await saveLocalImage(file);
      return NextResponse.json({ mode: "local", publicUrl, message: "图片已保存到本地 public/uploads/images。" });
    }

    const publicUrl = await uploadImage(state.client, bucket, file);
    return NextResponse.json({ mode: "supabase", publicUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 });
  }
}
