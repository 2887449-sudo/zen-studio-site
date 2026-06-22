import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminSeriesForm } from "@/components/AdminSeriesForm";

export default function NewSeriesPage() {
  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">NEW SERIES</p>
          <h1>新增作品</h1>
          <p>填写作品基础信息，视频内容在剧集里配置。</p>
        </div>
      </div>
      <section className="admin-panel">
        <AdminSeriesForm />
      </section>
    </AdminAuthGate>
  );
}
