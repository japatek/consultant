"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CartesianGrid, XAxis, YAxis, BarChart, Bar } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, ArrowRight } from "lucide-react";

const chartConfig = {
    inputTokens: { label: "Input", color: "var(--chart-1)" },
    outputTokens: { label: "Output", color: "var(--chart-2)" },
} satisfies ChartConfig;

interface TokenBarChartProps {
    readonly chartData: Array<{
        month: string;
        inputTokens: number;
        outputTokens: number;
    }>;
}

export function TokenBarChart({ chartData }: TokenBarChartProps) {
    const router = useRouter();
    const [mounted, setMounted] = React.useState(false);
    
    // 1. Cukup buat satu state untuk data grafik saja
    const [displayData, setDisplayData] = React.useState<typeof chartData>([]);

    React.useEffect(() => {
        const CACHE_KEY = "local-token-chart-cache-v2";
        
        // Ambil dari cache localStorage untuk instant load saat pindah halaman
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            setDisplayData(JSON.parse(cached));
        }

        // Jika ada data fresh dari props server, perbarui state dan cache
        if (chartData && chartData.length > 0) {
            setDisplayData(chartData);
            localStorage.setItem(CACHE_KEY, JSON.stringify(chartData));
        }

        setMounted(true);
    }, [chartData]);

    // 2. ✅ HITUNG LANGSUNG (Derived State): Menghilangkan bug angka 0
    // Nilai ini akan selalu sinkron dengan data yang dipakai oleh BarChart
    const totalInput = displayData.reduce((s, d) => s + d.inputTokens * 1000, 0);
    const totalOutput = displayData.reduce((s, d) => s + d.outputTokens * 1000, 0);

    console.log(totalInput,totalOutput)

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <CardTitle>Token Consumption</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <button className="flex items-center justify-center rounded-md hover:bg-muted p-1">
                                        <Info className="w-4 h-4 text-muted-foreground cursor-pointer" onClick={() => router.push('/docs/token/consumption')}/>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                    <p className="max-w-[200px]">
                                        Total token across input prompt, generated output and cache read/write. 1 token ≈ 4 characters in english
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <CardDescription>Input vs output tokens — Last 2 Months</CardDescription>
                <CardAction
                    className="flex items-center gap-1 text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => router.push('/dashboard/usage/viewtoken')}
                >
                    Detail <ArrowRight className="size-4" />
                </CardAction>
            </CardHeader>

            <CardContent className="grid grid-cols gap-6 items-center memory-layout">
                <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border bg-muted/20 px-3 py-4">
                        <p className="text-muted-foreground text-xs font-medium">Total Input</p>
                        <p className="font-bold text-lg tabular-nums mt-1">
                            {mounted && displayData.length > 0 ? `${(totalInput / 1_000_000).toFixed(3)}M` : "-"}
                        </p>
                    </div>
                    <div className="rounded-lg border bg-muted/20 px-3 py-4">
                        <p className="text-muted-foreground text-xs font-medium">Total Output</p>
                        <p className="font-bold text-lg tabular-nums mt-1">
                            {mounted && displayData.length > 0 ? `${(totalOutput / 1_000_000).toFixed(3)}M` : "-"}
                        </p>
                    </div>
                </div>

                <ChartContainer config={chartConfig} className="h-40 w-[260px] min-w-[260px]">
                    {mounted && displayData.length > 0 ? (
                        <BarChart data={displayData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }} barGap={6}>
                            <CartesianGrid vertical={false} strokeOpacity={0.2} />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                tick={{ fontSize: 11, fontWeight: 500 }}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={4}
                                tick={{ fontSize: 10 }}
                                tickFormatter={(v) => `${v}k`}
                            />
                            <ChartTooltip
                                cursor={{ fill: 'var(--muted)', opacity: 0.15 }}
                                content={
                                    <ChartTooltipContent
                                        className="w-40"
                                        formatter={(value, name) => {
                                            const tokenType = name === "inputTokens" ? "Input" : "Output";
                                            return `${tokenType}: ${Number(value).toLocaleString()}k tokens`;
                                        }}
                                    />
                                }
                            />
                            <Bar
                                dataKey="inputTokens"
                                fill="var(--color-inputTokens)"
                                radius={[4, 4, 0, 0]}
                                barSize={32}
                            />
                            <Bar
                                dataKey="outputTokens"
                                fill="var(--color-outputTokens)"
                                radius={[4, 4, 0, 0]}
                                barSize={32}
                            />
                        </BarChart>
                    ) : null}
                </ChartContainer>
            </CardContent>
        </Card>
    );
}