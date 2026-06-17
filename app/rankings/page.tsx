"use client";

import { useState } from "react";
import { RankingPanel } from "@/components/RankingPanel";
import { SeriesCard } from "@/components/SeriesCard";
import { useLanguage } from "@/components/LanguageProvider";
import { seriesList } from "@/lib/mock-data";

export default function RankingsPage() {
  const { locale } = useLanguage();
  const tabs = locale === "zh" ? ["热播榜", "新作榜", "收藏榜", "会员榜"] : ["Hot", "New", "Favorites", "Members"];
  const [active, setActive] = useState(tabs[0]);
  const recommendations = seriesList.filter((series) => series.status === "live").slice(0, 2);

  return (
    <main className="page rankings-page">
      <section className="subpage-hero dense-hero">
        <div className="container">
          <p className="eyebrow">RANKINGS</p>
          <h1>{locale === "zh" ? "排行榜" : "Rankings"}</h1>
          <p>{locale === "zh" ? "查看本周最受欢迎、最新上架与会员追更最多的 ZEN 漫剧。" : "Discover the hottest, newest, and most-followed ZEN motion comics."}</p>
        </div>
      </section>
      <section className="section compact">
        <div className="container rankings-layout">
          <div className="ranking-main">
            <div className="filter-row">
              {tabs.map((tab) => <button key={tab} className={`pill ${active === tab ? "active" : ""}`} onClick={() => setActive(tab)} type="button">{tab}</button>)}
            </div>
            <div className="ranking-title-card">
              <p className="eyebrow">{active}</p>
              <h2>{locale === "zh" ? "热度、播放量与追更人数综合排序" : "Ranked by heat, views, and followers"}</h2>
            </div>
            <RankingPanel />
          </div>
          <aside className="ranking-side">
            <p className="eyebrow">{locale === "zh" ? "热门推荐" : "Recommended"}</p>
            {recommendations.map((series, index) => (
              <SeriesCard key={series.id} series={series} locale={locale} featured={index === 0} />
            ))}
          </aside>
        </div>
      </section>
    </main>
  );
}
