"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type AdminImageFieldProps = {
  label: string;
  value: string;
  uploadType: "series-cover" | "series-hero" | "episode-thumbnail" | "hero-slide";
  onChange: (value: string) => void;
};

export function AdminImageField({ label, value, uploadType, onChange }: AdminImageFieldProps) {
  const [preview, setPreview] = useState(value);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const canPreview = useMemo(() => preview || value, [preview, value]);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
      setMessage("仅支持 10MB 以内的 jpg / jpeg / png / webp 图片。");
      return;
    }
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    const formData = new FormData();
    formData.set("type", uploadType);
    formData.set("file", file);
    try {
      setUploading(true);
      const result = await adminFetch<{ mode: "supabase" | "local"; publicUrl: string; message?: string }>("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      onChange(result.publicUrl);
      setPreview(result.publicUrl);
      setMessage(result.mode === "supabase" ? "已上传到 Supabase Storage。" : result.message || "已保存到本地模式。");
    } catch (error) {
      setMessage(error instanceof Error ? `${error.message} 可继续手动填写 URL。` : "上传失败，可继续手动填写 URL。");
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="admin-image-field">
      {label}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {canPreview ? <img src={preview || value} alt="" /> : null}
      <input value={value} onChange={(event) => { onChange(event.target.value); setPreview(event.target.value); }} placeholder="/images/... 或 https://..." />
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
      <small>{uploading ? "上传中..." : message || "可上传图片；未配置 Supabase Storage 时请填写 URL。"}</small>
    </label>
  );
}
