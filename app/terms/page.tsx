import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "用户协议 | ZEN 漫剧宇宙",
  description: "ZEN 漫剧宇宙用户协议，说明平台使用规则、会员服务和内容访问规范。"
};

export default function TermsPage() {
  return (
    <main className="page subpage legal-page">
      <section className="subpage-hero">
        <div className="container">
          <p className="eyebrow">TERMS</p>
          <h1>用户协议</h1>
          <p>使用 ZEN 漫剧宇宙即表示你同意遵守平台内容观看、账号使用和会员服务规则。</p>
        </div>
      </section>
      <section className="section compact">
        <div className="container legal-copy">
          <h2>服务说明</h2>
          <p>平台提供原创动态漫画内容、免费试看内容和会员专享内容。未接入真实支付前，所有会员功能均为 mock 展示。</p>
          <p>用户不得以破坏平台、安全绕过或未授权分享的方式使用服务。</p>
        </div>
      </section>
    </main>
  );
}
