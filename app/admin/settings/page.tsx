import { AdminAuthGate } from "@/components/AdminAuthGate";

export default function AdminSettingsPage() {
  return (
    <AdminAuthGate>
      <div className="admin-head">
        <div>
          <p className="eyebrow">SETTINGS</p>
          <h1>网站设置</h1>
          <p>当前版本先展示关键配置状态；正式站点设置后续可接入数据库配置表。</p>
        </div>
      </div>
      <section className="admin-panel">
        <table>
          <tbody>
            <tr><th>线上地址</th><td>https://www.qmcg.work</td></tr>
            <tr><th>后台默认密码</th><td>zen-admin-2026</td></tr>
            <tr><th>Supabase URL</th><td>{process.env.NEXT_PUBLIC_SUPABASE_URL ? "已配置" : "未配置"}</td></tr>
            <tr><th>Supabase Anon Key</th><td>{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "已配置" : "未配置"}</td></tr>
            <tr><th>Service Role Key</th><td>仅服务端使用，请在 Vercel 环境变量配置</td></tr>
          </tbody>
        </table>
      </section>
    </AdminAuthGate>
  );
}
