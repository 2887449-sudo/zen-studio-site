"use client";

import Link from "next/link";
import { Menu, UserRound, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";
import { useToast } from "@/components/ToastProvider";
import { trackEvent } from "@/lib/analytics-events";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { locale, copy } = useLanguage();
  const { showToast } = useToast();
  const nav = (copy.nav as string[]).map((label, index) => ({ label, href: (copy.navHrefs as string[])[index] }));
  const membershipMessage = locale === "zh" ? "会员系统即将开放，敬请期待。" : "Membership is coming soon. Stay tuned.";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled || open ? "is-scrolled" : ""}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="logo">ZEN</span>
          <span>MOTION COMICS</span>
        </Link>
        <nav className={`nav ${open ? "open" : ""}`}>
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? "active" : ""} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <LanguageToggle />
          <button className="icon-text ghost" type="button">
            <UserRound size={15} />
            <span>{copy.login}</span>
          </button>
          <button type="button" className="small-cta" onClick={() => { trackEvent("vip_cta_click", { source: "header" }); showToast(membershipMessage); }}>{copy.subscribe}</button>
          <button className="menu-button" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
