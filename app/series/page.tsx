"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { SeriesCard } from "@/components/SeriesCard";
import { useLanguage } from "@/components/LanguageProvider";
import { getSeriesCategories, getSeriesTitle, seriesList } from "@/lib/mock-data";

const categoriesZh = ["全部", "校园", "悬疑", "科幻", "都市", "少女", "热血"];
const categoriesEn = ["All", "School", "Mystery", "Sci-Fi", "Urban", "Girlhood", "Action"];

export default function SeriesPage() {
  const { locale } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(locale === "zh" ? "全部" : "All");
  const [vipOnly, setVipOnly] = useState(false);
  const [updatingOnly, setUpdatingOnly] = useState(false);
  const categories = locale === "zh" ? categoriesZh : categoriesEn;
  const allLabel = locale === "zh" ? "全部" : "All";

  const filtered = useMemo(() => {
    return seriesList.filter((series) => {
      const title = getSeriesTitle(series, locale).toLowerCase();
      const matchesQuery = !query || title.includes(query.toLowerCase());
      const matchesCategory = category === allLabel || getSeriesCategories(series, locale).includes(category);
      const matchesVip = !vipOnly || series.isVip;
      const matchesUpdating = !updatingOnly || series.badge === "更新中";
      return matchesQuery && matchesCategory && matchesVip && matchesUpdating;
    });
  }, [allLabel, category, locale, query, updatingOnly, vipOnly]);

  return (
    <main className="page subpage">
      <section className="subpage-hero">
        <div className="container">
          <p className="eyebrow">SERIES LIBRARY</p>
          <h1>{locale === "zh" ? "漫剧库" : "Series Library"}</h1>
          <p>{locale === "zh" ? "探索 ZEN 漫剧宇宙中的原创动态漫画，按类型、会员与更新状态快速筛选。" : "Explore original ZEN motion comics by genre, VIP access, and update status."}</p>
        </div>
      </section>
      <section className="section compact">
        <div className="container">
          <SectionTitle title={locale === "zh" ? "全部作品" : "All Series"} subtitle={locale === "zh" ? "持续扩展的原创 AI 漫剧片库" : "A growing library of original AI motion comics"} />
          <div className="library-tools">
            <label className="search-box">
              <Search size={18} />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "zh" ? "搜索漫剧" : "Search series"} />
            </label>
            <div className="filter-row">
              {categories.map((item) => (
                <button key={item} className={`pill ${category === item ? "active" : ""}`} onClick={() => setCategory(item)} type="button">{item}</button>
              ))}
              <button className={`pill ${vipOnly ? "active" : ""}`} onClick={() => setVipOnly((value) => !value)} type="button">VIP</button>
              <button className={`pill ${updatingOnly ? "active" : ""}`} onClick={() => setUpdatingOnly((value) => !value)} type="button">{locale === "zh" ? "更新中" : "Updating"}</button>
            </div>
          </div>
          <div className="series-grid">
            {filtered.map((series) => (
              <SeriesCard key={series.id} series={series} locale={locale} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
