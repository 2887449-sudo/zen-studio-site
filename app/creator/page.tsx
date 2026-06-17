"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { CreatorCooperation } from "@/components/CreatorCooperation";

const flowZh = ["提交IP", "内容评估", "角色与分镜开发", "漫剧上线", "平台推广"];
const flowEn = ["Submit IP", "Content Review", "Character & Storyboard", "Launch Series", "Platform Promotion"];

export default function CreatorPage() {
  const { locale } = useLanguage();
  const [sent, setSent] = useState(false);
  const flow = locale === "zh" ? flowZh : flowEn;

  return (
    <main className="page creator-page">
      <section className="subpage-hero dense-hero">
        <div className="container">
          <p className="eyebrow">CREATOR PROGRAM</p>
          <h1>{locale === "zh" ? "创作者计划" : "Creator Program"}</h1>
          <p>{locale === "zh" ? "ZEN 支持原创 IP 孵化、漫剧定制、角色设定、分镜策划、AI 动态漫画制作支持与平台联合推广。" : "ZEN supports original IP incubation, motion comic production, character design, storyboard planning, AI motion comic support, and platform co-promotion."}</p>
        </div>
      </section>
      <CreatorCooperation />
      <section className="section compact">
        <div className="container creator-flow">
          {flow.map((item, index) => (
            <div key={item} className="flow-step">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="section compact creator-form-section">
        <div className="container form-layout">
          <div>
            <p className="eyebrow">SUBMIT IP</p>
            <h2>{locale === "zh" ? "提交你的作品" : "Submit Your Project"}</h2>
            <p>{locale === "zh" ? "欢迎原创作者、编剧和 IP 持有方提交项目。当前为 mock 表单，后续可接入 Supabase 表单与邮件通知。" : "Original creators, writers, and IP owners are welcome. This mock form can later connect to Supabase and email notifications."}</p>
          </div>
          <form className="creator-form elevated-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
            <input placeholder={locale === "zh" ? "姓名" : "Name"} />
            <input placeholder={locale === "zh" ? "邮箱" : "Email"} type="email" />
            <input placeholder={locale === "zh" ? "项目类型" : "Project Type"} />
            <textarea placeholder={locale === "zh" ? "项目简介" : "Project Brief"} />
            <button className="btn primary" type="submit">{locale === "zh" ? "提交" : "Submit"} <ArrowUpRight size={16} /></button>
            {sent ? <p className="success">{locale === "zh" ? "已收到，后续会接入真实提交接口。" : "Received. A real submission endpoint can be connected later."}</p> : null}
          </form>
        </div>
      </section>
    </main>
  );
}
