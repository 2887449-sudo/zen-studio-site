import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "隐私政策 | ZEN 漫剧宇宙",
  description: "ZEN 漫剧宇宙隐私政策，说明平台如何处理用户信息与观看体验数据。"
};

export default function PrivacyPage() {
  return (
    <main className="page subpage legal-page">
      <section className="subpage-hero">
        <div className="container">
          <p className="eyebrow">PRIVACY</p>
          <h1>隐私政策</h1>
          <p>本页面为上线前占位版本，后续将根据实际账号、支付与视频服务完善。</p>
        </div>
      </section>
      <section className="section compact">
        <div className="container legal-copy">
          <h2>我们如何处理信息</h2>
          <p>ZEN 漫剧宇宙会在用户使用平台时处理必要的账号、观看记录、会员状态和服务安全信息，用于提供内容访问、会员权益和平台体验优化。</p>
          <p>在接入 Supabase、支付服务或视频托管后，我们将补充对应第三方服务的数据处理说明。</p>
        </div>
      </section>
    </main>
  );
}
