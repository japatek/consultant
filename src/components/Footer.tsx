// website/src/components/Footer.tsx
//
// JaPaTek footer (English only). Rendered on the marketing / non-app 
// pages (login, download, documentation, terms, not-found, pricing) 
// by importing <Footer /> at the bottom of each page's JSX. 
// NOT used inside the chat shell, which keeps its own chrome-less layout.

"use client";

import React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { IconBrandInstagram, IconBrandTwitter, IconBrandWhatsapp, IconBrandWhatsappFilled } from "@tabler/icons-react";
import XTwitterLogoIcon from "./ui/twitter";

const PRODUCT_SURFACES = [
  { href: "/download", id: "web", label: "Website" },
  { href: "/download#browser-extension", id: "ext", label: "Browser Extension" },
  { href: "/download#vscode-ext", id: "vsc", label: "VSCode Extension" },
  { href: "/download#office-ext", id: "off", label: "Office Add-in" },
  { href: "/download/cad", id: "cad", label: "CAD Add-ins (Pro)" },
  { href: "/download#desktop", id: "desk", label: "Desktop App" },
  { href: "/download#mobile", id: "mob", label: "Mobile App" },
  { href: "/download#cli", id: "cli", label: "Terminal CLI" },
] as const;

const RESOURCES = [
  { href: "/docs", id: "docs", label: "Documentation" },
  { href: "/pricing", id: "price", label: "Pricing" },
  { href: "/terms", id: "terms", label: "Terms of Service" },
  { href: "/privacy", id: "privacy", label: "Privacy Policy" },
] as const;

const COMPANY = [
  { href: "mailto:info@japtektek.com", id: "contact", label: "Contact" },
  { href: "https://japtektek.com", id: "japtektek", label: "PT. Japa Teknika Solusi" },
] as const;

export default function Footer() {
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
            Engineering consultant and ai tool/agent provider.
          </p>
          <div className="flex flex-col-4 gap-4">          
            <IconBrandWhatsapp className="cursor-pointer" href="https://wa.me/628988350450" />
            <IconBrandInstagram className="cursor-pointer" href="https://www.instagram.com/japateksolusi?igsh=cTY4YmVycHU5NTlw"/>
            <XTwitterLogoIcon className="cursor-pointer pt-1" size={20}/>
            
          </div>

        </div>

        {/* Middle: nav columns */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6 pb-4 border-b border-dashed border-border/20">
          <FooterCol heading="Products" items={[...PRODUCT_SURFACES]} />
          <FooterCol heading="Resources" items={[...RESOURCES]} />
          <FooterCol heading="Company" items={[...COMPANY]} />
        </div>

        {/* Compliance / disclaimer */}
        {/* <div className="p-3 bg-blue-400/4 border border-dashed border-amber-500/30 rounded-lg flex flex-col gap-1.5">
          <p className="m-0 text-xs text-muted-foreground/80 leading-relaxed">
            <strong>Disclaimer:</strong> JaPaTek is an AI engine. Anything it
            produces may be wrong—always verify the output before relying on
            it for production or business decisions.
          </p>
        </div> */}

        {/* Bottom bar */}
        <div className="flex flex-wrap justify-between items-center gap-3 pt-2 text-xs text-muted-foreground/60">
          <p className="m-0">
            © {new Date().getFullYear()} PT. Japa Teknika Solusi · All rights reserved
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
              Terms
            </Link>
            <span className="opacity-40">·</span>
            <Link
              href="/privacy"
              className="text-inherit no-underline hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
          </p>
        </div>

      </div>
    </footer>
  );
}

interface ColItem {
  href: string;
  id: string;
  label: string;
}

function FooterCol({
  heading,
  items,
}: Readonly<{ heading: string; items: ColItem[] }>) {
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
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}