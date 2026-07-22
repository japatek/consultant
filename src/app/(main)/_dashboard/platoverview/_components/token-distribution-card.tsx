'use client'
import * as React from "react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Label, Pie, PieChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter, CardAction } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";


// --- DATA & KONFIGURASI ---
const mission = {
  Dev: { label: "Developer Team" },
  Sales: { label: "Marketing Team" },
  Manage: { label: "Management Team" },
} as const;

type MissionKey = keyof typeof mission;
type TaskKey = "task1" | "task2" | "task3";
type TokenDataType = { tokenusage: string; amount: number; key: TaskKey; percentage: number }[];

const teamTokenData: Record<MissionKey, { input: TokenDataType; output: TokenDataType }> = {
  Dev: {
    input: [
      { tokenusage: "Develop Website (Context)", amount: 68_320, key: "task1", percentage: 50.1 },
      { tokenusage: "Testing Website (Prompts)", amount: 42_780, key: "task2", percentage: 31.4 },
      { tokenusage: "Maintaining Website (Queries)", amount: 25_256, key: "task3", percentage: 18.5 },
    ],
    output: [
      { tokenusage: "Generated Code Blocks", amount: 48_320, key: "task1", percentage: 43.0 },
      { tokenusage: "Test Case Outputs", amount: 36_780, key: "task2", percentage: 32.7 },
      { tokenusage: "Log Analysis Summaries", amount: 27_256, key: "task3", percentage: 24.3 },
    ],
  },
  Sales: {
    input: [
      { tokenusage: "Campaign Brief Content", amount: 85_000, key: "task1", percentage: 56.6 },
      { tokenusage: "Brand Tone Guidelines", amount: 45_000, key: "task2", percentage: 30.0 },
      { tokenusage: "Raw Market Data Transcripts", amount: 20_000, key: "task3", percentage: 13.4 },
    ],
    output: [
      { tokenusage: "Ad Copy & Email Sequences", amount: 65_000, key: "task1", percentage: 52.0 },
      { tokenusage: "Social Media Posts Content", amount: 40_000, key: "task2", percentage: 32.0 },
      { tokenusage: "Competitor Strategy Reports", amount: 20_000, key: "task3", percentage: 16.0 },
    ],
  },
  Manage: {
    input: [
      { tokenusage: "Raw Financial Spreadsheets", amount: 22_000, key: "task1", percentage: 45.4 },
      { tokenusage: "Meeting Audio Transcripts", amount: 16_500, key: "task2", percentage: 34.0 },
      { tokenusage: "Project Timelines Docs", amount: 10_000, key: "task3", percentage: 20.6 },
    ],
    output: [
      { tokenusage: "Audit Executive Summaries", amount: 18_500, key: "task1", percentage: 42.0 },
      { tokenusage: "Formated Meeting Minutes", amount: 15_000, key: "task2", percentage: 34.1 },
      { tokenusage: "Resource Allocation Charts Data", amount: 10_500, key: "task3", percentage: 23.9 },
    ],
  },
};

const chartConfig = {
  amount: { label: "Token Usage" },
  task1: { color: "var(--chart-1)" },
  task2: { color: "var(--chart-2)" },
  task3: { color: "var(--chart-3)" },
} satisfies ChartConfig;

export function TokenDistributionCard() {
  const router = useRouter();
  const [selectedMission, setSelectedMission] = React.useState<MissionKey>("Dev");
  const [showOutput, setShowOutput] = React.useState<boolean>(false);

  const chartData = React.useMemo(() => {
    const currentMode = showOutput ? "output" : "input";
    return teamTokenData[selectedMission][currentMode].map((item) => ({
      ...item,
      fill: chartConfig[item.key]?.color || "var(--chart-1)",
    }));
  }, [selectedMission, showOutput]);

  const totalTokens = React.useMemo(() => {
    return chartData.reduce((total, item) => total + item.amount, 0);
  }, [chartData]);

  return (
    <Card className="transition-all duration-200 flex flex-col justify-between" >
      <CardHeader className="pb-2">
        <CardTitle className="font-semibold text-base">Token Allocation</CardTitle>
        <CardDescription>Distribution based on team workflow</CardDescription>

        {/* Menambahkan cursor-pointer dan sedikit efek hover agar lebih interaktif */}
        <CardAction
          className="flex items-center gap-1 text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors"
          onClick={() => router.push('/dashboard/usage/manager')}
        >
          Detail <ArrowRight className="size-4" />
        </CardAction>
      </CardHeader>

      {/* 1. Menghapus h-71 agar tinggi menyesuaikan secara compact & rapi */}
      <CardContent className="grid items-center gap-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] pb-4">
        {/* 2. Mengecilkan aspek rasio tinggi chart container menjadi h-40 */}
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-40">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel className="w-52" nameKey="tokenusage" />}
            />
            <Pie
              cornerRadius={4}
              data={chartData}
              dataKey="amount"
              innerRadius={55}
              nameKey="tokenusage"
              outerRadius={75}
              paddingAngle={2}
              strokeWidth={4}
            >
              <Label
                onClick={() => router.push('/dashboard/usage/manager')}
                content={({ viewBox }) => {
                  if (!(viewBox && "cx" in viewBox && "cy" in viewBox)) {
                    return null;
                  }
                  return (
                    <text dominantBaseline="middle" textAnchor="middle" x={viewBox.cx} y={viewBox.cy}>
                      <tspan className="fill-muted-foreground text-[10px] uppercase tracking-wider" x={viewBox.cx} y={(viewBox.cy ?? 0) - 8}>
                        {showOutput ? "Total Out" : "Total In"}
                      </tspan>
                      <tspan
                        className="fill-foreground font-bold text-base tabular-nums"
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 10}
                      >
                        {totalTokens.toLocaleString()}
                      </tspan>
                    </text>
                  );
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="flex min-w-0 flex-col gap-2.5">
          {chartData.map((item) => (
            <div className="grid grid-cols-[1fr_auto] items-end gap-3" key={item.tokenusage}>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span aria-hidden="true" className="h-2 w-1 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                  <p className="truncate text-muted-foreground text-xs">{item.tokenusage}</p>
                </div>
                <p className="font-semibold tabular-nums text-xs mt-0.5">
                  {item.amount.toLocaleString()} Tokens
                </p>
              </div>
              <div className="font-medium tabular-nums text-xs text-muted-foreground">
                {item.percentage}%
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* 3. CardFooter diletakkan di luar CardContent dengan utilitas justify-between */}
      <CardFooter className="w-full flex flex-row items-center justify-between gap-2 pt-2 pb-4 border-t border-border/40 bg-muted/5">
        {/* Komponen Kiri: Switch */}
        <div className="flex w-36 items-center justify-between gap-2 rounded-md border border-input px-2 py-1 bg-background shadow-sm">
          <span className={cn("text-[11px] font-medium transition-colors", !showOutput ? "text-foreground" : "text-muted-foreground")}>
            Input
          </span>
          <Switch
            size="default"
            checked={showOutput}
            onCheckedChange={setShowOutput}
            aria-label="Toggle token rate mode"
            className="cursor-pointer scale-90"
          />
          <span className={cn("text-[11px] font-medium transition-colors", showOutput ? "text-foreground" : "text-muted-foreground")}>
            Output
          </span>
        </div>

        {/* Komponen Kanan: Select Team */}
        <div>
          <Select onValueChange={(value) => setSelectedMission(value as MissionKey)} value={selectedMission}>
            <SelectTrigger className="w-40 h-8 text-xs shadow-sm" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.entries(mission).map(([value, item]) => (
                  <SelectItem key={value} value={value} className="text-xs">
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </CardFooter>
    </Card>
  );
}