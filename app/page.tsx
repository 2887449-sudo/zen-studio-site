"use client";

import Link from "next/link";
import { CreatorCooperation } from "@/components/CreatorCooperation";
import { HeroSection } from "@/components/HeroSection";
import { LatestUpdates } from "@/components/LatestUpdates";
import { MembershipStrip } from "@/components/MembershipStrip";
import { RankingPanel } from "@/components/RankingPanel";
import { SectionTitle } from "@/components/SectionTitle";
import { SeriesCard } from "@/components/SeriesCard";
import { useLanguage } from "@/components/LanguageProvider";
import { Reveal } from "@/components/Reveal";
import { usePublishedContent } from "@/hooks/usePublishedContent";

export default function Home() {
  const { locale, copy } = useLanguage();
  const { series } = usePublishedContent();
  const featuredSeries = series.filter((item) => item.status === "live").slice(0, 4);

  return (
    <main className="page">
      <HeroSection />
      <Reveal className="section">
        <div className="container">
          <div className="section-head-row">
            <SectionTitle title={copy.featuredTitle as string} subtitle={copy.featuredSubtitle as string} />
            <Link href="/series" className="view-all-link">
              {locale === "zh" ? "查看全部漫剧" : "View All Series"} <span>→</span>
            </Link>
          </div>
          <div className="series-rail">
            {featuredSeries.map((series, index) => (
              <SeriesCard key={series.id} series={series} locale={locale} featured={index === 0} />
            ))}
          </div>
        </div>
      </Reveal>
      <MembershipStrip />
      <Reveal className="section">
        <div className="container split-layout">
          <div>
            <SectionTitle title={copy.latestTitle as string} subtitle={copy.latestSubtitle as string} />
            <LatestUpdates />
          </div>
          <div>
            <SectionTitle title={copy.rankingTitle as string} subtitle={copy.rankingSubtitle as string} />
            <RankingPanel />
          </div>
        </div>
      </Reveal>
      <CreatorCooperation />
    </main>
  );
}
