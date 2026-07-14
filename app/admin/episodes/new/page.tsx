import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminEpisodeForm } from "@/components/AdminEpisodeForm";

export default function NewEpisodePage() {
  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">NEW EPISODE</p>
          <h1>新增剧集</h1>
          <p>可以上传缩略图和视频，也可以直接填写已有视频地址。</p>
        </div>
      </div>
      <section className="admin-panel">
        <AdminEpisodeForm />
      </section>
    </AdminAuthGate>
  );
}
