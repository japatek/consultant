// website/src/components/Footer.tsx
//
// JaPaTek footer. Rendered on the marketing / non-app 
// pages (login, download, documentation, terms, not-found, pricing) 
// by importing <Footer /> at the bottom of each page's JSX. 
// NOT used inside the chat shell, which keeps its own chrome-less layout.

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { IconBrandInstagram, IconBrandWhatsapp } from "@tabler/icons-react";
import XTwitterLogoIcon from "./ui/twitter";

// 1. Added id_label for Indonesian translations
const SERVICES_SURFACES = [
  { href: "/download", id: "web", label: "Website", id_label: "Situs Web" },
  { href: "/download/ui", id: "ext", label: "Desktop App", id_label: "Aplikasi Desktop" },
  { href: "/download/documentation", id: "off", label: "Documentation", id_label: "Dokumentasi" },
  { href: "/download/cad", id: "cad", label: "CAD Add-ins (Pro)", id_label: "Add-in Software CAD/CAE" },
] as const;

const RESOURCES = [
  { href: "/docs", id: "docs", label: "Documentation", id_label: "Dokumentasi" },
  { href: "/marketplace", id: "tool", label: "Tools", id_label: "Alat" },
  { href: "/terms", id: "terms", label: "Terms of Service", id_label: "Ketentuan Layanan" },
  { href: "/privacy", id: "privacy", label: "Privacy Policy", id_label: "Kebijakan Privasi" },
] as const;

const COMPANY = [
  { href: "mailto:info@japatek.com", id: "contact", label: "Contact", id_label: "Kontak" },
  { href: "https://japatek.com", id: "japatek", label: "PT. Japa Teknika Solusi", id_label: "PT. Japa Teknika Solusi" },
] as const;

export default function Footer() {
  // 2. Setup Language State and Listener
  const [lang, setLang] = useState<string>("en");

  useEffect(() => {
    const currentLang = Cookies.get("language") || "en";
    setLang(currentLang);
    
    const handleLangChange = (e: any) => {
      if (e.detail) setLang(e.detail);
    };

    window.addEventListener("languageChange", handleLangChange);
    return () => window.removeEventListener("languageChange", handleLangChange);
  }, []);

  return (
    <footer className="w-full bg-card text-foreground border-t border-border/20 text-2xl leading-relaxed">
      <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-6 flex flex-col gap-7">

        {/* Top: brand + tagline */}
        <div className="flex flex-col gap-2 pb-4 border-b border-dashed border-border/20">
          <Link href="/" className="font-bold text-4xl tracking-tight no-underline text-inherit">
            <span className="bg-gradient-to-br from-rose-400 to-primary bg-clip-text text-transparent">
              JaPaTek
            </span>
          </Link>
          <p className="m-0 text-[13px] text-muted-foreground flex flex-wrap items-baseline gap-2">
            {lang === "id" 
              ? "Konsultan teknik dan penyedia alat/agen AI." 
              : "Engineering consultant and ai tool/agent provider."}
          </p>
          <div className="flex flex-col-4 gap-4 mt-2">
            {/* Wrapped icons in anchor tags so the links actually work */}
            <a href="https://wa.me/628988350450" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <IconBrandWhatsapp className="cursor-pointer" />
            </a>
            <a href="https://www.instagram.com/japateksolusi?igsh=cTY4YmVycHU5NTlw" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              <IconBrandInstagram className="cursor-pointer" />
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <XTwitterLogoIcon className="cursor-pointer pt-1" size={20}/>
            </a>
          </div>

        </div>

        {/* Middle: nav columns */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 pb-4 border-b border-dashed border-border/20">
          <FooterCol 
            heading={lang === "id" ? "Produk" : "Products"} 
            items={[...SERVICES_SURFACES]} 
            lang={lang} 
          />
          <FooterCol 
            heading={lang === "id" ? "Sumber Daya" : "Resources"} 
            items={[...RESOURCES]} 
            lang={lang} 
          />
          <FooterCol 
            heading={lang === "id" ? "Perusahaan" : "Company"} 
            items={[...COMPANY]} 
            lang={lang} 
          />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 pt-2 text-xs text-muted-foreground/60">
          <p className="m-0">
            © {new Date().getFullYear()} PT. Japa Teknika Solusi · {lang === "id" ? "Hak cipta dilindungi undang-undang" : "All rights reserved"}
          </p>
          <p className="m-0 inline-flex flex-wrap gap-1.5 items-baseline">
            <Link
              href="mailto:info@japatek.com"
              className="text-inherit no-underline hover:text-foreground transition-colors"
            >
              info@japatek.com
            </Link>
            <span className="opacity-40">·</span>
            <Link
              href="/terms"
              className="text-inherit no-underline hover:text-foreground transition-colors"
            >
              {lang === "id" ? "Ketentuan" : "Terms"}
            </Link>
            <span className="opacity-40">·</span>
            <Link
              href="/privacy"
              className="text-inherit no-underline hover:text-foreground transition-colors"
            >
              {lang === "id" ? "Privasi" : "Privacy"}
            </Link>
          </p>
        </div>

      </div>
    </footer>
  );
}

// 3. Updated Interface to accept id_label and lang
interface ColItem {
  href: string;
  id: string;
  label: string;
  id_label?: string; // Optional Indonesian label
}

function FooterCol({
  heading,
  items,
  lang,
}: Readonly<{ heading: string; items: ColItem[]; lang: string }>) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="m-0 text-xs font-semibold text-foreground uppercase tracking-widest flex flex-wrap gap-1.5 items-baseline">
        {heading}
      </h3>
      <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.id} className="m-0">
            <Link
              href={item.href}
              className="text-muted-foreground no-underline text-[13px] inline-flex flex-wrap items-baseline gap-1 hover:text-foreground transition-colors"
            >
              {/* Uses Indonesian label if language is ID, otherwise English */}
              {lang === "id" && item.id_label ? item.id_label : item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}