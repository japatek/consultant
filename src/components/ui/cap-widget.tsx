"use client";

import React, { useEffect, useRef, useState } from "react";

export interface CapWidgetProps {
  onVerify: (token: string) => void;
  onExpire: () => void;
}

export function CapWidget({ onVerify, onExpire }: CapWidgetProps): React.JSX.Element | null {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Memuat script secara asinkron
  useEffect(() => {
    const widgetUrl = process.env.NEXT_PUBLIC_CAP_WIDGET_URL || "https://cdn.jsdelivr.net/npm/cap-widget";

    if (document.querySelector(`script[src="${widgetUrl}"]`)) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = widgetUrl;
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  // 2. Menginisialisasi elemen dan mendengarkan event
  useEffect(() => {
    if (!scriptLoaded || !containerRef.current) return;

    containerRef.current.innerHTML = "";

    const siteKey = process.env.NEXT_PUBLIC_CAP_SITE_KEY;
    const capInstanceUrl = "/api/cap" 
    
    if (!siteKey) {
      console.error("[CapWidget] Error: NEXT_PUBLIC_CAP_SITE_KEY is missing from .env");
      return;
    }

    const apiEndpoint = `${capInstanceUrl}/${siteKey}/`;
    const capEl = document.createElement("cap-widget");
    capEl.setAttribute("data-cap-api-endpoint", apiEndpoint);
    
    const handleSolve = (e: any) => {
      const token = e.detail?.token;
      if (token) {
        onVerify(token);
      }
    };

    const handleReset = () => {
      onExpire();
    };

    capEl.addEventListener("solve", handleSolve);
    capEl.addEventListener("expire", handleReset);
    capEl.addEventListener("error", handleReset);

    containerRef.current.appendChild(capEl);

    return () => {
      capEl.removeEventListener("solve", handleSolve);
      capEl.removeEventListener("expire", handleReset);
      capEl.removeEventListener("error", handleReset);
    };
  }, [scriptLoaded, onVerify, onExpire]);

  if (!scriptLoaded) {
    return (
      <div className="flex h-[74px] w-full items-center justify-center rounded-lg border border-border/60 bg-muted/30">
        <span className="animate-pulse text-xs text-muted-foreground">Loading security check…</span>
      </div>
    );
  }

  return <div ref={containerRef} className="h-[74px] w-full overflow-hidden" />;
}