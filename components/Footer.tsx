"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics-events";

const legalLinks = [
  { href: "/privacy", zh: "隐私政策", en: "Privacy" },
  { href: "/terms", zh: "用户协议", en: "Terms" },
  { href: "/copyright", zh: "版权声明", en: "Copyright" },
  { href: "/contact", zh: "联系我们", en: "Contact" }
];

export function Footer() {
  const { copy, locale } = useLanguage();
  const { showToast } = useToast();
  const nav = (copy.nav as string[]).map((label, index) => ({ label, href: (copy.navHrefs as string[])[index] }));
  const zh = locale === "zh";
  const membershipMessage = zh ? "会员系统即将开放，敬请期待。" : "Membership is coming soon. Stay tuned.";

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="logo">ZEN</Link>
            <p>ZEN Motion Comics Universe</p>
            <p>contact@zenmotioncomics.com</p>
          </div>
          <div>
            <h3>{zh ? "导航" : "Navigation"}</h3>
            {nav.slice(0, 4).map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
          </div>
          <div>
            <h3>{zh ? "平台" : "Platform"}</h3>
            {nav.slice(4).map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
            <button type="button" className="footer-link-button" onClick={() => { trackEvent("vip_cta_click", { source: "footer" }); showToast(membershipMessage); }}>
              {zh ? "立即开通" : "Join Now"}
            </button>
          </div>
          <div>
            <h3>{zh ? "法律" : "Legal"}</h3>
            {legalLinks.map((item) => (
              <Link key={item.href} href={item.href}>{zh ? item.zh : item.en}</Link>
            ))}
          </div>
          <div>
            <h3>{zh ? "关注我们" : "Follow"}</h3>
            {["微博", "B站", "抖音", "邮箱"].map((social) => (
              <a key={social} href="#">{social}</a>
            ))}
          </div>
        </div>
        <div className="footer-bottom">{copy.footerRights}</div>
      </div>
    </footer>
  );
}
