"use client";

import { format, parse } from "date-fns";
import { ArrowUpRight, DollarSign, PackageCheck, ReceiptText, RotateCcw, ShoppingBag, Users } from "lucide-react";
import { Area, Bar, CartesianGrid, ComposedChart, XAxis, YAxis } from "recharts";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const revenueBucketRanges = ["01-05", "06-10", "11-15", "16-20", "21-25", "26-31"] as const;

const revenueBucketValues = [
  [4820, 5150, 5060, 5520, 5990, 6880],
  [5140, 5360, 5520, 5860, 6120, 6720],
  [4920, 4680, 5150, 5360, 5720, 6150],
  [5480, 5920, 5660, 6180, 6340, 6660],
  [5840, 6220, 6480, 6110, 6680, 7230],
  [6280, 6740, 6960, 7120, 6780, 7240],
  [6820, 7240, 7680, 7410, 7920, 7810],
  [6040, 6420, 6150, 6860, 7080, 7090],
  [5860, 6120, 6340, 6080, 6620, 6900],
  [6520, 6840, 7060, 7420, 7160, 8280],
  [6980, 7320, 7640, 7160, 8040, 8620],
  [6900, 7400, 8100, 8600, 8200, 9360],
] as const;

const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

function getRollingRevenueBuckets() {
  const currentMonth = new Date();
  currentMonth.setDate(1);

  return revenueBucketValues.map((values, index) => {
    const monthDate = new Date(currentMonth);
    monthDate.setMonth(currentMonth.getMonth() - (revenueBucketValues.length - 1 - index));

    return {
      month: `${monthFormatter.format(monthDate)} ${String(monthDate.getFullYear()).slice(-2)}`,
      values,
    };
  });
}

const revenueOverviewData = getRollingRevenueBuckets().flatMap(({ month, values }) =>
  values.map((revenue, index) => ({
    period: `${month} ${revenueBucketRanges[index]}`,
    profit: Math.round(revenue * (index % 3 === 0 ? 0.24 : index % 3 === 1 ? 0.28 : 0.26)),
    revenue,
  })),
);

const revenueOverviewConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--foreground)",
  },
  profit: {
    label: "Profit",
    color: "var(--muted-foreground)",
  },
} satisfies ChartConfig;

function formatMonthTick(value: string) {
  const parts = value.split(" ");
  const range = parts.at(-1);
  const month = parts.slice(0, -1).join(" ");

  return range === "11-15" ? month : "";
}

function formatTooltipLabel(value: string) {
  const parts = value.split(" ");
  const range = parts.at(-1);
  const month = parse(parts.slice(0, -1).join(" "), "MMM yy", new Date());
  const [start, end] = String(range).split("-");
  const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const startDate = new Date(month.getFullYear(), month.getMonth(), Number(start));
  const endDate = new Date(month.getFullYear(), month.getMonth(), Math.min(Number(end), lastDayOfMonth));

  return `${format(month, "MMM")} ${format(startDate, "do")} - ${format(endDate, "do")}, ${format(month, "yyyy")}`;
}

function formatCurrencyTooltipValue(value: unknown) {
  return typeof value === "number" ? `$${value.toLocaleString()}` : String(value ?? "");
}

export function KpiStrip() {
  return (
    <div className="h-full overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 xl:col-span-12">
      <div>
        <div className="grid grid-cols-1 xl:grid-cols-12">
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 xl:col-span-5 xl:border-r">
            <Card className="h-full rounded-none border-0 border-border border-b ring-0 md:border-r">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Total Sales</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  $48,560.00
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <DollarSign className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-green-700 dark:text-green-300">+15.8%</span>
                  <span className="text-muted-foreground"> vs last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full rounded-none border-0 border-border border-b ring-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Total Orders</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  379
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <ShoppingBag className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-green-700 dark:text-green-300">+8.3%</span>
                  <span className="text-muted-foreground"> vs last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full rounded-none border-0 border-border border-b ring-0 md:border-r">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Customer Growth</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  820
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <Users className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-green-700 dark:text-green-300">+12.5%</span>
                  <span className="text-muted-foreground"> vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full rounded-none border-0 border-border border-b ring-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Average Order</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  $128
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <ReceiptText className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-destructive">-$4.20</span>
                  <span className="text-muted-foreground"> vs last week</span>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full rounded-none border-0 border-border border-b ring-0 md:border-r md:border-b-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Return Requests</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  18
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <RotateCcw className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-destructive">+0.6%</span>
                  <span className="text-muted-foreground"> vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="h-full rounded-none border-0 ring-0">
              <CardHeader>
                <CardTitle className="font-normal text-sm">Stock Accuracy</CardTitle>
                <CardDescription className="text-3xl text-foreground tabular-nums leading-none tracking-tight">
                  97%
                </CardDescription>
                <CardAction className="grid size-6 place-items-center rounded-sm bg-muted">
                  <PackageCheck className="size-3 text-foreground" />
                </CardAction>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <span className="text-green-700 dark:text-green-300">+2.4 pts</span>
                  <span className="text-muted-foreground"> vs last audit</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="h-full rounded-none border-0 ring-0 xl:col-span-7">
            <CardHeader>
              <CardTitle className="font-normal">Sales Overview</CardTitle>
              <CardAction>
                <ArrowUpRight className="size-4" />
              </CardAction>
            </CardHeader>

            <CardContent>
              <ChartContainer config={revenueOverviewConfig} className="h-74 w-full">
                <ComposedChart
                  accessibilityLayer
                  data={revenueOverviewData}
                  margin={{ bottom: 0, left: 0, right: 0, top: 0 }}
                >
                  <defs>
                    <filter id="sales-line-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feFlood floodColor="var(--color-revenue)" floodOpacity="0.35" />
                      <feComposite in2="blur" operator="in" />
                      <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <CartesianGrid yAxisId="profit" vertical={false} />
                  <XAxis
                    dataKey="period"
                    axisLine={false}
                    height={30}
                    interval={0}
                    minTickGap={0}
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => formatMonthTick(String(value))}
                  />
                  <YAxis yAxisId="revenue" hide domain={[3000, 10_000]} />
                  <YAxis yAxisId="profit" hide domain={[0, 6000]} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-40"
                        labelFormatter={(value) => formatTooltipLabel(String(value))}
                        formatter={(value, name, item) => (
                          <>
                            <div
                              className="size-2.5 shrink-0 rounded-[2px]"
                              style={{
                                backgroundColor: item.color,
                              }}
                            />
                            <div className="flex flex-1 items-center justify-between leading-none">
                              <span className="text-muted-foreground">{String(name ?? "")}</span>
                              <span className="font-medium font-mono text-foreground tabular-nums">
                                {formatCurrencyTooltipValue(value)}
                              </span>
                            </div>
                          </>
                        )}
                      />
                    }
                    cursor={{
                      stroke: "var(--border)",
                      strokeDasharray: "4 4",
                    }}
                  />
                  <Bar
                    yAxisId="profit"
                    barSize={4}
                    dataKey="profit"
                    fill="var(--color-profit)"
                    name="Profit"
                    opacity={0.18}
                    radius={[6, 6, 0, 0]}
                  />
                  <Area
                    yAxisId="revenue"
                    dataKey="revenue"
                    fill="none"
                    filter="url(#sales-line-glow)"
                    name="Revenue"
                    stroke="var(--color-revenue)"
                    strokeWidth={1.8}
                    type="linear"
                    activeDot={{
                      r: 4,
                      fill: "var(--background)",
                      stroke: "var(--color-revenue)",
                      strokeWidth: 2,
                    }}
                    dot={false}
                  />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
// "use client";

// import { Activity, Bot, TrendingDown, TrendingUp, Zap } from "lucide-react";

// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { MOCK_AGENTS, MOCK_TASKS, MOCK_USAGE } from "@/lib/agents/types";

// export function KpiStrip() {
//   const activeAgents = MOCK_AGENTS.filter((a) => a.status === "active").length;
//   const errorAgents = MOCK_AGENTS.filter((a) => a.status === "error").length;
//   const runningTasks = MOCK_TASKS.filter((t) => t.status === "running").length;
//   const todayUsage = MOCK_USAGE.at(-1);
//   const prevUsage = MOCK_USAGE.at(-2);
//   const totalTokensToday = (todayUsage?.inputTokens ?? 0) + (todayUsage?.outputTokens ?? 0);
//   const totalTokensPrev = (prevUsage?.inputTokens ?? 0) + (prevUsage?.outputTokens ?? 0);
//   const tokenDelta = totalTokensPrev > 0 ? ((totalTokensToday - totalTokensPrev) / totalTokensPrev) * 100 : 0;

//   return (
//     <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
//       <div className="grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
//         <Card className="rounded-none border-0 ring-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 font-normal text-sm">
//               <div className="grid size-6 place-items-center rounded-md bg-muted">
//                 <Bot className="size-3.5" />
//               </div>
//               Active Agents
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col gap-2">
//             <div className="flex items-center gap-3">
//               <span className="text-3xl tabular-nums leading-none tracking-tight">{activeAgents}</span>
//               <Badge className="gap-1 bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300">
//                 <span className="size-1.5 rounded-full bg-current animate-pulse" />
//                 Live
//               </Badge>
//             </div>
//             <p className="text-muted-foreground text-xs">
//               {errorAgents} agent{errorAgents !== 1 ? "s" : ""} need attention
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="rounded-none border-0 ring-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 font-normal text-sm">
//               <div className="grid size-6 place-items-center rounded-md bg-muted">
//                 <Activity className="size-3.5" />
//               </div>
//               Running Tasks
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col gap-2">
//             <div className="flex items-center gap-3">
//               <span className="text-3xl tabular-nums leading-none tracking-tight">{runningTasks}</span>
//               <Badge variant="outline" className="tabular-nums">
//                 {MOCK_TASKS.filter((t) => t.status === "queued").length} queued
//               </Badge>
//             </div>
//             <p className="text-muted-foreground text-xs">
//               {MOCK_TASKS.filter((t) => t.status === "completed").length} completed today
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="rounded-none border-0 ring-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 font-normal text-sm">
//               <div className="grid size-6 place-items-center rounded-md bg-muted">
//                 <Zap className="size-3.5" />
//               </div>
//               Tokens Today
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col gap-2">
//             <div className="flex items-center gap-3">
//               <span className="text-3xl tabular-nums leading-none tracking-tight">
//                 {(totalTokensToday / 1_000_000).toFixed(1)}M
//               </span>
//               <Badge
//                 className={
//                   tokenDelta >= 0
//                     ? "bg-green-500/10 text-green-700 dark:bg-green-500/15 dark:text-green-300"
//                     : "bg-destructive/10 text-destructive"
//                 }
//               >
//                 {tokenDelta >= 0 ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
//                 {Math.abs(tokenDelta).toFixed(1)}%
//               </Badge>
//             </div>
//             <p className="text-muted-foreground text-xs">
//               ${todayUsage?.costUsd.toFixed(2) ?? "0.00"} estimated cost
//             </p>
//           </CardContent>
//         </Card>

//         <Card className="rounded-none border-0 ring-0">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2 font-normal text-sm">
//               <div className="grid size-6 place-items-center rounded-md bg-muted">
//                 <Zap className="size-3.5" />
//               </div>
//               API Requests
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="flex flex-col gap-2">
//             <div className="flex items-center gap-3">
//               <span className="text-3xl tabular-nums leading-none tracking-tight">
//                 {(todayUsage?.requests ?? 0).toLocaleString()}
//               </span>
//               <Badge variant="outline" className="tabular-nums">today</Badge>
//             </div>
//             <p className="text-muted-foreground text-xs">
//               {((todayUsage?.requests ?? 0) / 24).toFixed(0)} avg/hour
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }