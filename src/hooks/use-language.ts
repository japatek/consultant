"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { translations, type Language } from "@/translate/language-data";

/**
 * Same pattern used across the existing site (cookie + `languageChange`
 * window event), pulled into one hook so every new component doesn't
 * reimplement it. Returns the resolved `t` object directly since that's
 * what every component actually wants.
 */
export function useLanguage() {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const currentLang = (Cookies.get("language") as Language) || "en";
    setLang(currentLang);

    const handleLangChange = (e: Event) => {
      const detail = (e as CustomEvent<Language>).detail;
      if (detail) setLang(detail);
    };

    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  return { lang, t: translations[lang] };
}
