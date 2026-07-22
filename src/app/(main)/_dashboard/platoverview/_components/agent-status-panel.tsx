import Link from "next/link";
import { ArrowRight, ArrowUpRightIcon } from "lucide-react";
import { IconFolderCode, IconPanoramaHorizontal } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

type AgentStatus = "active" | "idle" | "error" | "paused" | "initializing";

interface AgentData {
  id: String;
  name: String;
  status: string;
  lastActiveAt: Date;
  uptimePercent: number;
  avgLatencyMs: number;
  inputTokens: number;
  outputTokens: number;
}

interface AgentStatusPanelProps {
  agents: AgentData[];
}

const statusConfig: Record<AgentStatus, { label: string; dot: string; badge: string }> = {
  active: {
    label: "Active",
    dot: "bg-green-500",
    badge: "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900/40 dark:bg-green-500/15 dark:text-green-300",
  },
  idle: {
    label: "Idle",
    dot: "bg-muted-foreground",
    badge: "border-border bg-muted/50 text-muted-foreground",
  },
  error: {
    label: "Error",
    dot: "bg-destructive",
    badge: "border-destructive/20 bg-destructive/10 text-destructive",
  },
  paused: {
    label: "Paused",
    dot: "bg-amber-500",
    badge: "border-amber-200 bg-amber-500/10 text-amber-700 dark:border-amber-900/40 dark:bg-amber-500/15 dark:text-amber-300",
  },
  initializing: {
    label: "Init",
    dot: "bg-blue-500",
    badge: "border-blue-200 bg-blue-500/10 text-blue-700 dark:border-blue-900/40 dark:bg-blue-500/15 dark:text-blue-300",
  },
};

function formatRelativeTime(dateInput: Date) {
  const diff = Math.floor((Date.now() - new Date(dateInput).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function AgentStatusPanel({ agents }: AgentStatusPanelProps) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Agent Status</CardTitle>
          <CardDescription>Real-time health across all provisioned agents</CardDescription>
        </div>
        {/* Tombol View All hanya muncul jika ada data agent */}
        {agents.length > 0 && (
          <CardAction>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/agents">
                View all <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className={cn("flex flex-col gap-3", agents.length === 0 && "items-center justify-center")}>

        {/* CONDITION 1: EMPTY STATE MENGGUNAKAN KOMPONEN KUSTOM ANDA */}
        {agents.length === 0 ? (
          <Empty className="border border-dashed py-4">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconPanoramaHorizontal />
              </EmptyMedia>
              <EmptyTitle>No Agents Yet</EmptyTitle>
              <EmptyDescription>
                You haven't created any agents yet. Get started by creating
                your first AI agent.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" asChild>
                <Button asChild>
                  <Link href="/dashboard/agents/quickstart">Create Agent</Link>
                </Button>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (

          /* CONDITION 2: DYNAMIC LIST STATE UI (JIKA AGENT TERSEDIA DARI PRISMA) */
          agents.map((agent) => {
            const currentStatus = (agent.status as AgentStatus) || "idle";
            const cfg = statusConfig[currentStatus];
            const totalTokens = agent.inputTokens + agent.outputTokens;
            const healthScore = currentStatus === "error" ? 20 : currentStatus === "paused" ? 50 : agent.uptimePercent;

            return (
              <div
                key={agent.id.toString()}
                className="flex flex-col gap-2 rounded-lg border bg-muted/20 px-3 py-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={cn("size-2 shrink-0 rounded-full", cfg.dot, currentStatus === "active" && "animate-pulse")} />
                    <span className="truncate font-medium text-sm">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-muted-foreground text-xs tabular-nums hidden sm:inline">
                      {formatRelativeTime(agent.lastActiveAt)}
                    </span>
                    <Badge variant="outline" className={cn("h-5 px-1.5 text-[10px]", cfg.badge)}>
                      {cfg.label}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Uptime</p>
                    <p className="tabular-nums font-medium">{agent.uptimePercent.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Latency</p>
                    <p className="tabular-nums font-medium">{agent.avgLatencyMs.toLocaleString()}ms</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tokens</p>
                    <p className="tabular-nums font-medium">
                      {(totalTokens / 1_000_000).toFixed(1)}M
                    </p>
                  </div>
                </div>

                <Progress
                  value={healthScore}
                  className={cn(
                    "h-1",
                    currentStatus === "error" && "*:data-[slot=progress-indicator]:bg-destructive",
                    currentStatus === "paused" && "*:data-[slot=progress-indicator]:bg-amber-500",
                  )}
                />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}