import { SeriesDetailClient } from "@/components/SeriesDetailClient";

export default async function SeriesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SeriesDetailClient slug={slug} />;
}
