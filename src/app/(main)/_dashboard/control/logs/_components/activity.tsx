import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_LOGS, type LogLevel } from "@/lib/agents/dev-types";
import { cn } from "@/lib/utils";

const levelConfig: Record<LogLevel, { label: string; className: string }> = {
  info: { label: "INFO", className: "border-border bg-muted/50 text-muted-foreground" },
  debug: { label: "DEBUG", className: "border-border bg-muted/50 text-muted-foreground/60" },
  warn: { label: "WARN", className: "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300" },
  error: { label: "ERROR", className: "border-destructive/20 bg-destructive/10 text-destructive" },
  success: { label: "OK", className: "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300" },
};

const sourceColor: Record<string, string> = {
  web: "text-blue-600 dark:text-blue-400",
  llm: "text-violet-600 dark:text-violet-400",
  mcp: "text-amber-600 dark:text-amber-400",
  "mission-control": "text-primary",
  agent: "text-foreground",
};

function formatRelativeTime(isoString: string) {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function ActivityFeed() {
  const recent = MOCK_LOGS.slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Activity</CardTitle>
        <CardDescription>Live log stream across all services</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/mission-control">
              Full logs <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex flex-col divide-y">
          {recent.map((log) => {
            const cfg = levelConfig[log.level];
            return (
              <div key={log.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors">
                <Badge variant="outline" className={cn("mt-px h-4 shrink-0 px-1 text-[9px] uppercase tracking-wider", cfg.className)}>
                  {cfg.label}
                </Badge>
                <div className="min-w-0 flex-1 grid gap-0.5">
                  <p className="text-xs leading-relaxed text-foreground line-clamp-2">{log.message}</p>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className={cn("font-medium uppercase tracking-wide", sourceColor[log.source])}>
                      {log.source}
                    </span>
                    <span>·</span>
                    <span className="tabular-nums">{formatRelativeTime(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}