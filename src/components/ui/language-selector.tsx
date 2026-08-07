"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function LanguageSelector() {
  const router = useRouter();
  const [currentLang, setCurrentLang] = React.useState("en");

  React.useEffect(() => {
    // Set initial language on load
    const lang = Cookies.get("language") || "en";
    setCurrentLang(lang);

    // Keep multiple selectors (desktop/mobile) in sync
    const handleSync = (e: any) => setCurrentLang(e.detail);
    window.addEventListener("languageChange", handleSync);
    return () => window.removeEventListener("languageChange", handleSync);
  }, []);

  const selectLanguage = (value: string) => {
    if (!value) return; 

    // 1. Save to cookie
    Cookies.set("language", value, { expires: 365, path: '/' });
    
    // 2. Update local state
    setCurrentLang(value);
    
    // 3. Broadcast the change to the Navbar and other components instantly
    window.dispatchEvent(new CustomEvent("languageChange", { detail: value }));
    
    // 4. Tell Server Components to refresh
    router.refresh();
  };

  return (
    <ToggleGroup 
      type="single" 
      value={currentLang} 
      onValueChange={selectLanguage}
      className="bg-card/40 border border-border/30 p-0.5 rounded-lg h-9"
    >
      <ToggleGroupItem 
        value="en" 
        aria-label="English"
        className="h-7 px-2.5 text-xs font-bold transition-all data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm cursor-pointer"
      >
        EN
      </ToggleGroupItem>
      <ToggleGroupItem 
        value="id" 
        aria-label="Indonesian"
        className="h-7 px-2.5 text-xs font-bold transition-all data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm cursor-pointer"
      >
        ID
      </ToggleGroupItem>
    </ToggleGroup>
  );
}