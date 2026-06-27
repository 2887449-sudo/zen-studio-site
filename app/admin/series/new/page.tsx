import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminSeriesForm } from "@/components/AdminSeriesForm";

export default function NewSeriesPage() {
  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">UPLOAD SERIES</p>
          <h1>上传作品</h1>
          <p>这里上传的是“作品资料”：作品名称、简介、分类、封面图和推荐图。真正的视频在下一步“上传剧集”里填写视频地址。</p>
        </div>
      </div>
      <section className="admin-panel">
        <AdminSeriesForm />
      </section>
    </AdminAuthGate>
  );
}
