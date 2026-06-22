import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminEpisodeForm } from "@/components/AdminEpisodeForm";

export default async function EditEpisodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">EDIT EPISODE</p>
          <h1>编辑剧集</h1>
          <p>修改后保存到当前浏览器的 localStorage。</p>
        </div>
      </div>
      <section className="admin-panel">
        <AdminEpisodeForm id={id} />
      </section>
    </AdminAuthGate>
  );
}
