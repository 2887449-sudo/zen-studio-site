import { AdminAuthGate } from "@/components/AdminAuthGate";
import { AdminSeriesForm } from "@/components/AdminSeriesForm";

export default async function EditSeriesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">EDIT SERIES</p>
          <h1>编辑作品</h1>
          <p>修改后保存到当前浏览器的 localStorage。</p>
        </div>
      </div>
      <section className="admin-panel">
        <AdminSeriesForm id={id} />
      </section>
    </AdminAuthGate>
  );
}
