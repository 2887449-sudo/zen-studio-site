"use client";

import { ChangeEvent, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type AdminVideoFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function AdminVideoField({ label, value, onChange }: AdminVideoFieldProps) {
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("");
    if (!["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"].includes(file.type) || file.size > 500 * 1024 * 1024) {
      setMessage("仅支持 500MB 以内的 mp4 / webm / mov / mkv 视频。");
      return;
    }
    const formData = new FormData();
    formData.set("file", file);
    try {
      setUploading(true);
      const result = await adminFetch<{ publicUrl: string; mode: "supabase" | "local"; message?: string }>("/api/admin/upload-video", {
        method: "POST",
        body: formData
      });
      onChange(result.publicUrl);
      setMessage(result.message || "视频上传成功，地址已自动填入。");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "视频上传失败。");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="admin-video-field">
      {label}
      {value ? <video src={value} controls preload="metadata" /> : null}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="上传后自动生成，也可手动填写视频地址" />
      <input type="file" accept="video/mp4,video/webm,video/quicktime,video/x-matroska" onChange={handleFile} />
      <small>{uploading ? "视频上传中，请不要关闭页面..." : message || "选择视频文件后，系统会自动上传并填入地址。"}</small>
    </label>
  );
}
