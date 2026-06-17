import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "联系我们 | ZEN 漫剧宇宙",
  description: "联系 ZEN 漫剧宇宙，进行合作咨询、创作者投稿或会员问题反馈。"
};

export default function ContactPage() {
  return (
    <main className="page subpage legal-page">
      <section className="subpage-hero">
        <div className="container">
          <p className="eyebrow">CONTACT</p>
          <h1>联系我们</h1>
          <p>欢迎通过以下邮箱联系 ZEN 漫剧宇宙团队。</p>
        </div>
      </section>
      <section className="section compact">
        <div className="container legal-copy">
          <h2>contact@zenmotioncomics.com</h2>
          <p>合作咨询：原创 IP、漫剧联合开发、平台合作。</p>
          <p>创作者投稿：故事企划、角色设定、样片与作品集。</p>
          <p>会员问题：试看、会员权益、账号与观看体验反馈。</p>
        </div>
      </section>
    </main>
  );
}
