"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { useToast } from "@/components/ToastProvider";
import type { CmsEpisode, CmsHeroSlide, CmsSeries } from "@/lib/cms-types";
import {
  getAdminPassword,
  getManagedEpisodes,
  getManagedHeroSlides,
  getManagedSeries
} from "@/lib/content-storage";

type TransferData = {
  version: 1;
  exportedAt: string;
  series: CmsSeries[];
  episodes: CmsEpisode[];
  heroSlides: CmsHeroSlide[];
};

type ImportSummary = {
  seriesCreated: number;
  seriesUpdated: number;
  seriesSkipped: number;
  episodesCreated: number;
  episodesUpdated: number;
  episodesSkipped: number;
  heroCreated: number;
  heroUpdated: number;
  heroSkipped: number;
};

function snapshot(): TransferData {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    series: getManagedSeries(),
    episodes: getManagedEpisodes(),
    heroSlides: getManagedHeroSlides()
  };
}

function normalizeTransferData(value: unknown): TransferData {
  const input = value && typeof value === "object" ? value as Partial<TransferData> : {};
  return {
    version: 1,
    exportedAt: typeof input.exportedAt === "string" ? input.exportedAt : new Date().toISOString(),
    series: Array.isArray(input.series) ? input.series : [],
    episodes: Array.isArray(input.episodes) ? input.episodes : [],
    heroSlides: Array.isArray(input.heroSlides) ? input.heroSlides : []
  };
}

export default function AdminImportExportPage() {
  const { showToast } = useToast();
  const [localData, setLocalData] = useState<TransferData | null>(null);
  const [importData, setImportData] = useState<TransferData | null>(null);
  const [conflictMode, setConflictMode] = useState<"overwrite" | "skip">("overwrite");
  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalData(snapshot());
  }, []);

  const preview = importData || localData;
  const localAssetCount = useMemo(() => {
    if (!preview) return 0;
    const values = [
      ...preview.series.flatMap((item) => [item.coverUrl, item.heroImageUrl]),
      ...preview.episodes.flatMap((item) => [item.thumbnailUrl, item.previewVideoUrl, item.fullVideoUrl]),
      ...preview.heroSlides.map((item) => item.imageUrl)
    ];
    return values.filter((value) => typeof value === "string" && value.startsWith("/uploads/")).length;
  }, [preview]);

  function exportJson() {
    const data = snapshot();
    setLocalData(data);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `zen-content-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("本地数据 JSON 已导出。");
  }

  async function chooseJson(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setSummary(null);
    try {
      setImportData(normalizeTransferData(JSON.parse(await file.text())));
    } catch {
      setError("JSON 文件无法解析，请选择从本页导出的文件。");
    }
  }

  async function importToSupabase() {
    if (!preview) return;
    const password = getAdminPassword();
    if (!password) {
      setError("后台登录已失效，请重新登录。");
      return;
    }
    setImporting(true);
    setError("");
    setSummary(null);
    try {
      const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);
      const apiBase = isLocal ? "https://www.qmcg.work" : "";
      const response = await fetch(`${apiBase}/api/admin/import`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
          "Authorization": `Bearer ${password}`
        },
        body: JSON.stringify({ ...preview, conflictMode })
      });
      const result = await response.json() as { summary?: ImportSummary; error?: string };
      if (!response.ok || !result.summary) throw new Error(result.error || "导入失败");
      setSummary(result.summary);
      showToast("已导入 Supabase，未重复创建相同 slug。");
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "导入失败");
    } finally {
      setImporting(false);
    }
  }

  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">IMPORT / EXPORT</p>
          <h1>本地数据迁移</h1>
          <p>把 localhost 浏览器中保存的作品、剧集和 Hero 导出为 JSON，再安全导入 Supabase。</p>
        </div>
      </div>

      <section className="admin-panel admin-transfer-actions">
        <button type="button" className="btn dark-outline" onClick={exportJson}>导出当前 localStorage JSON</button>
        <label className="btn dark-outline">选择 JSON 文件<input type="file" accept="application/json,.json" onChange={chooseJson} hidden /></label>
      </section>

      {preview ? (
        <section className="admin-panel">
          <h2>导入预览</h2>
          <div className="admin-stat-grid admin-transfer-stats">
            <div><span>作品</span><strong>{preview.series.length}</strong></div>
            <div><span>剧集</span><strong>{preview.episodes.length}</strong></div>
            <div><span>Hero</span><strong>{preview.heroSlides.length}</strong></div>
            <div><span>本地文件引用</span><strong>{localAssetCount}</strong></div>
          </div>
          <div className="admin-transfer-preview">
            {preview.series.map((item) => (
              <div key={item.id}><strong>{item.titleZh || item.titleEn}</strong><span>{item.slug}</span></div>
            ))}
          </div>
          {localAssetCount ? (
            <p className="admin-transfer-warning">发现 {localAssetCount} 个本地文件地址。内容数据可以先导入；这些地址在线上不可直接访问，请到“素材管理”选择 Storage 已有文件绑定，不需要重复上传已有素材。</p>
          ) : null}
          <div className="admin-transfer-options">
            <label><input type="radio" checked={conflictMode === "overwrite"} onChange={() => setConflictMode("overwrite")} /> 相同 slug：覆盖更新</label>
            <label><input type="radio" checked={conflictMode === "skip"} onChange={() => setConflictMode("skip")} /> 相同 slug：跳过</label>
          </div>
          <button type="button" className="btn primary" disabled={importing || !preview.series.length} onClick={() => void importToSupabase()}>
            {importing ? "正在导入..." : "导入到线上 Supabase"}
          </button>
        </section>
      ) : null}

      {summary ? (
        <section className="admin-panel admin-import-result">
          <h2>导入完成</h2>
          <p>作品：新增 {summary.seriesCreated}，更新 {summary.seriesUpdated}，跳过 {summary.seriesSkipped}</p>
          <p>剧集：新增 {summary.episodesCreated}，更新 {summary.episodesUpdated}，跳过 {summary.episodesSkipped}</p>
          <p>Hero：新增 {summary.heroCreated}，更新 {summary.heroUpdated}，跳过 {summary.heroSkipped}</p>
        </section>
      ) : null}
      {error ? <p className="admin-form-error">{error}</p> : null}
    </AdminAuthGate>
  );
}
