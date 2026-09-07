"use client";

import { translations, Language } from '@/translate/language-data';
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
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

    const t = translations[lang];

    return (
        <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 mb-6 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            {t.bck}
        </button>
    );
}