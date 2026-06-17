import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "版权声明 | ZEN 漫剧宇宙",
  description: "ZEN 漫剧宇宙版权声明，保护平台内容和创作者作品权益。"
};

export default function CopyrightPage() {
  return (
    <main className="page subpage legal-page">
      <section className="subpage-hero">
        <div className="container">
          <p className="eyebrow">COPYRIGHT</p>
          <h1>版权声明</h1>
          <p>平台内容版权归 ZEN 或对应创作者所有。</p>
        </div>
      </section>
      <section className="section compact">
        <div className="container legal-copy">
          <h2>内容保护</h2>
          <p>ZEN 漫剧宇宙中的动态漫画、角色、海报、剧集、文案、视觉素材和页面设计，除另有说明外，版权归 ZEN 或对应创作者所有。</p>
          <p>未经授权，不得转载、录屏、搬运、二次分发、商用或用于训练、再生成等用途。</p>
          <p>如需合作授权，请联系 contact@zenmotioncomics.com。</p>
        </div>
      </section>
    </main>
  );
}
