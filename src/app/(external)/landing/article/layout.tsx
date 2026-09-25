"use client"; // Wajib ditambahkan agar useRouter berfungsi

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "../../landing/_components/nav-bar"; // Sesuaikan path ini jika letak nav-bar berbeda
import { translations, Language } from '@/translate/language-data';
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [lang, setLang] = useState<Language>('en');
  useEffect(() => {
      const currentLang = (Cookies.get("language") as Language) || 'en';
      setLang(currentLang);
      
      const handleLangChange = (e: any) => {
        if (e.detail) setLang(e.detail as Language);
      };
  
      window.addEventListener('languageChange', handleLangChange);
      return () => window.removeEventListener('languageChange', handleLangChange);
    }, []);
  
    // Fetch the dictionary for the active language
    const t = translations[lang];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Global Top Navbar */}
      <Navbar />
      
      {/* Ditambahkan pt-20 md:pt-24 agar konten tidak tertutup oleh Navbar fixed */}
      <main className="flex flex-1 items-start pt-20 md:pt-24">
        {/* Center Content */}
        <div className="mx-auto w-full min-w-0 px-6 py-8 md:px-8">
          

          {/* Konten Halaman */}
          {children}
          
        </div>
      </main>
    </div>
  )
}


