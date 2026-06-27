import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/db/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const VIDEO_BUCKET = "episode-videos";
const MAX_VIDEO_SIZE = 500 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"];

function safeName(name: string) {
  const extension = name.split(".").pop() || "mp4";
  return `${Date.now()}-${crypto.randomUUID()}.${extension.toLowerCase()}`;
}

function isAllowedVideo(file: File) {
  return ALLOWED_VIDEO_TYPES.includes(file.type) && file.size <= MAX_VIDEO_SIZE;
}

async function saveLocalVideo(file: File) {
  const fileName = safeName(file.name);
  const uploadDir = path.join(process.cwd(), "public", "uploads", "videos");
  await mkdir(uploadDir, { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(path.join(uploadDir, fileName), Buffer.from(arrayBuffer));
  return `/uploads/videos/${fileName}`;
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File) || !isAllowedVideo(file)) {
      return NextResponse.json({ error: "仅支持 500MB 以内的 mp4 / webm / mov / mkv 视频。" }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    if (supabase) {
      const fileName = safeName(file.name);
      const { error } = await supabase.storage.from(VIDEO_BUCKET).upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type
      });
      if (error) throw error;
      const { data } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(fileName);
      return NextResponse.json({ mode: "supabase", publicUrl: data.publicUrl });
    }

    const publicUrl = await saveLocalVideo(file);
    return NextResponse.json({ mode: "local", publicUrl, message: "视频已保存到本地 public/uploads/videos，线上同步需要配置 Supabase Storage。" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "视频上传失败" }, { status: 500 });
  }
}
