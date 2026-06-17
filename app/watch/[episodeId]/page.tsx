import { WatchClient } from "@/components/WatchClient";

export default async function WatchPage({ params }: { params: Promise<{ episodeId: string }> }) {
  const { episodeId } = await params;
  return <WatchClient episodeId={episodeId} />;
}
