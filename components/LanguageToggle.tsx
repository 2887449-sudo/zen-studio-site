"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { trackEvent } from "@/lib/analytics-events";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="language-toggle" aria-label="Language switcher">
      <button className={locale === "zh" ? "active" : ""} onClick={() => { trackEvent("language_switch", { from: locale, to: "zh" }); setLocale("zh"); }} type="button">
        中文
      </button>
      <button className={locale === "en" ? "active" : ""} onClick={() => { trackEvent("language_switch", { from: locale, to: "en" }); setLocale("en"); }} type="button">
        EN
      </button>
    </div>
  );
}
