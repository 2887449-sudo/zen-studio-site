import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminEpisodeForm } from "@/components/AdminEpisodeForm";

export default function NewEpisodePage() {
  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">NEW EPISODE</p>
          <h1>新增剧集</h1>
          <p>视频只填写地址，暂不做上传。</p>
        </div>
      </div>
      <section className="admin-panel">
        <AdminEpisodeForm />
      </section>
    </AdminAuthGate>
  );
}
