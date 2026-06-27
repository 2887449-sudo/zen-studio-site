import { AdminAuthGate } from "@/components/AdminAuthGate";

const buckets = ["series-covers", "series-heroes", "episode-thumbnails", "hero-slides", "episode-videos"];

export default function AdminMediaPage() {
  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">MEDIA</p>
          <h1>素材管理</h1>
          <p>图片上传已接入作品、剧集和 Hero 表单。这里先作为 Storage bucket 配置说明。</p>
        </div>
      </div>
      <section className="admin-panel">
        <h2>需要创建的 Supabase Storage Bucket</h2>
        <div className="admin-bucket-grid">
          {buckets.map((bucket) => <div key={bucket}>{bucket}</div>)}
        </div>
        <p className="admin-note">图片支持 jpg / jpeg / png / webp，单张 10MB 以内。剧集视频现在支持在后台直接上传；未配置 Supabase 时会先保存到本地 public/uploads/videos。</p>
      </section>
    </AdminAuthGate>
  );
}
