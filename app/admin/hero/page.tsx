"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminImageField } from "@/components/AdminImageField";
import { adminFetch } from "@/lib/admin-api";
import {
  createLocalId,
  getManagedHeroSlides,
  saveManagedHeroSlides,
  upsertManagedHeroSlide,
  type ManagedHeroSlide
} from "@/lib/content-storage";
import type { ApiListResponse } from "@/lib/cms-types";

const emptyHero: ManagedHeroSlide = {
  id: "",
  titleZh: "",
  titleEn: "",
  subtitleZh: "",
  subtitleEn: "",
  badgeZh: "",
  badgeEn: "",
  episodeInfoZh: "",
  episodeInfoEn: "",
  imageUrl: "",
  seriesSlug: "",
  isActive: true,
  sortOrder: 0
};

export default function AdminHeroPage() {
  const [items, setItems] = useState<ManagedHeroSlide[]>([]);
  const [form, setForm] = useState<ManagedHeroSlide>({ ...emptyHero, id: createLocalId("hero") });
  const [mode, setMode] = useState<"supabase" | "local">("local");
  const [message, setMessage] = useState("");

  async function refresh() {
    setItems(getManagedHeroSlides());
    try {
      const result = await adminFetch<ApiListResponse<ManagedHeroSlide>>("/api/admin/hero");
      setMode(result.mode);
      if (result.items.length || result.mode === "supabase") setItems(result.items);
    } catch {
      setMode("local");
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  function update<K extends keyof ManagedHeroSlide>(key: K, value: ManagedHeroSlide[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (!form.titleZh) {
      setMessage("请填写 Hero 中文标题。");
      return;
    }
    try {
      if (mode === "supabase" && !form.id.startsWith("hero-")) {
        await adminFetch(`/api/admin/hero/${form.id}`, { method: "PUT", body: JSON.stringify(form) });
      } else if (mode === "supabase") {
        await adminFetch("/api/admin/hero", { method: "POST", body: JSON.stringify(form) });
      } else {
        upsertManagedHeroSlide(form);
      }
      setForm({ ...emptyHero, id: createLocalId("hero") });
      setMessage("Hero 已保存。");
      await refresh();
    } catch (error) {
      upsertManagedHeroSlide(form);
      setMessage(error instanceof Error ? `${error.message} 已保存到本地模式。` : "已保存到本地模式。");
      await refresh();
    }
  }

  async function remove(item: ManagedHeroSlide) {
    if (!window.confirm(`确认删除 Hero「${item.titleZh}」？`)) return;
    if (mode === "supabase") {
      await adminFetch(`/api/admin/hero/${item.id}`, { method: "DELETE" });
      await refresh();
      return;
    }
    const next = items.filter((entry) => entry.id !== item.id);
    saveManagedHeroSlides(next);
    setItems(next);
  }

  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">HERO</p>
          <h1>Hero 管理</h1>
          <p>{mode === "local" ? "当前为本地/模拟数据模式，数据不会同步线上。" : "当前已连接 Supabase。"}</p>
        </div>
      </div>
      <section className="admin-panel">
        <form className="admin-edit-form" onSubmit={save}>
          <label>中文标题<input value={form.titleZh} onChange={(event) => update("titleZh", event.target.value)} required /></label>
          <label>英文标题<input value={form.titleEn || ""} onChange={(event) => update("titleEn", event.target.value)} /></label>
          <label>中文副标题<textarea value={form.subtitleZh || ""} onChange={(event) => update("subtitleZh", event.target.value)} /></label>
          <label>英文副标题<textarea value={form.subtitleEn || ""} onChange={(event) => update("subtitleEn", event.target.value)} /></label>
          <label>中文标签<input value={form.badgeZh || ""} onChange={(event) => update("badgeZh", event.target.value)} /></label>
          <label>英文标签<input value={form.badgeEn || ""} onChange={(event) => update("badgeEn", event.target.value)} /></label>
          <label>中文更新信息<input value={form.episodeInfoZh || ""} onChange={(event) => update("episodeInfoZh", event.target.value)} /></label>
          <label>英文更新信息<input value={form.episodeInfoEn || ""} onChange={(event) => update("episodeInfoEn", event.target.value)} /></label>
          <AdminImageField label="Hero 图片" value={form.imageUrl || ""} bucket="hero-slides" onChange={(value) => update("imageUrl", value)} />
          <label>跳转作品 slug<input value={form.seriesSlug || ""} onChange={(event) => update("seriesSlug", event.target.value)} /></label>
          <label>排序<input type="number" value={form.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} /></label>
          <label className="admin-check"><input type="checkbox" checked={form.isActive} onChange={(event) => update("isActive", event.target.checked)} /> 启用</label>
          <div className="admin-form-actions"><button className="btn primary" type="submit">保存 Hero</button></div>
          {message ? <p className="admin-form-error">{message}</p> : null}
        </form>
      </section>
      <section className="admin-panel">
        <h2>Hero 列表</h2>
        <table>
          <thead><tr><th>图片</th><th>标题</th><th>标签</th><th>跳转 slug</th><th>启用</th><th>排序</th><th>操作</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="admin-thumb" src={item.imageUrl} alt="" />
                ) : "-"}</td>
                <td>{item.titleZh}</td>
                <td>{item.badgeZh}</td>
                <td>{item.seriesSlug}</td>
                <td>{item.isActive ? "启用" : "停用"}</td>
                <td>{item.sortOrder}</td>
                <td className="admin-table-actions">
                  <button type="button" onClick={() => setForm(item)}>编辑</button>
                  <button type="button" onClick={() => remove(item)}>删除</button>
                </td>
              </tr>
            ))}
            {!items.length ? <tr><td colSpan={7}>暂无 Hero，前台会继续使用当前 4 张 mock 轮播。</td></tr> : null}
          </tbody>
        </table>
      </section>
    </AdminAuthGate>
  );
}
