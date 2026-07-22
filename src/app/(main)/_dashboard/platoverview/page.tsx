import { TokenBarChart } from "./_components/token-barchart"; 
import { MetricCards } from "./_components/metric-cards";
import { TokenDistributionCard } from "./_components/token-distribution-card";
import { WelcomeDate } from "@/components/ui/welcomedate";
import { ButtonHoverCard } from "./_components/custom-button-hover-card";
import { buttonsData } from "@/navigation/button/overviewpage-button";
import { AgentStatusPanel } from "./_components/agent-status-panel";
import { prisma } from "@/lib/database/prisma";
import { unstable_cache } from "next/cache";
import { auth } from "@/lib/auth/auth";

export const revalidate = 0;

const getCachedTokenUsage = unstable_cache(
    async () => {
        const newestRecord = await prisma.agent.findFirst({
            orderBy: { updatedAt: "desc" },
            select: { updatedAt: true },
        });

        if (!newestRecord) {
            return [];
        }


        const latestDate = newestRecord.updatedAt;
        const startOfLatestMonth = new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
        const endOfLatestMonth = new Date(latestDate.getFullYear(), latestDate.getMonth() + 1, 1);

        const secondNewestRecord = await prisma.agent.findFirst({
            where: { updatedAt: { lt: startOfLatestMonth } },
            orderBy: { updatedAt: "desc" },
            select: { updatedAt: true },
        });

        const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });
        const latestMonthLabel = formatter.format(startOfLatestMonth);

        const latestMonthAgg = prisma.agent.aggregate({
            _sum: { inputTokens: true, outputTokens: true },
            where: {
                updatedAt: {
                    gte: startOfLatestMonth,
                    lt: endOfLatestMonth,
                },
            },
        });

        let secondLatestMonthAgg = null;
        let secondLatestMonthLabel = "";

        if (secondNewestRecord) {
            const secondDate = secondNewestRecord.updatedAt;
            const startOfSecondLatestMonth = new Date(secondDate.getFullYear(), secondDate.getMonth(), 1);
            const endOfSecondLatestMonth = new Date(secondDate.getFullYear(), secondDate.getMonth() + 1, 1);

            secondLatestMonthLabel = formatter.format(startOfSecondLatestMonth);
            secondLatestMonthAgg = prisma.agent.aggregate({
                _sum: { inputTokens: true, outputTokens: true },
                where: {
                    updatedAt: {
                        gte: startOfSecondLatestMonth,
                        lt: endOfSecondLatestMonth,
                    },
                },
            });
        }

        const [latestMonthData, secondLatestMonthData] = await Promise.all([
            latestMonthAgg,
            secondLatestMonthAgg,
        ]);

        const results = [];

        if (secondLatestMonthData) {
            results.push({
                month: secondLatestMonthLabel,
                inputTokens: Math.round((secondLatestMonthData._sum.inputTokens || 0) / 1000),
                outputTokens: Math.round((secondLatestMonthData._sum.outputTokens || 0) / 1000),
            });
        }

        results.push({
            month: latestMonthLabel,
            inputTokens: Math.round((latestMonthData._sum.inputTokens || 0) / 1000),
            outputTokens: Math.round((latestMonthData._sum.outputTokens || 0) / 1000),
        });

        return results;
    },
    ['token-usage-chart-data'],
    {
        revalidate: 3600,
        tags: ['token-usage']
    }
);

const getCachedAgentExist = unstable_cache(
    async () => { 
        const agents = await prisma.agent.findMany({
            orderBy: { createdAt: "desc" }
        });
        return agents;
    },
    ['agents-list'], 
    {
        revalidate: 3600,
        tags: ['agents']
    }
);



export default async function Logs() {
    const currentAgents = await getCachedAgentExist();
    // const formattedChartData = await getCachedTokenUsage(); is for future ai
    const session = await auth()
    
    return (
        <div className="@container/main w-full">
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 md:gap-6 px-4 md:px-0">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <WelcomeDate name={session?.user?.name ? session.user.name.charAt(0).toUpperCase() + session.user.name.slice(1) : 'How Are You?'} />
                    <div className="flex flex-col-3 gap-2">
                        {buttonsData.map((item) => (
                            <ButtonHoverCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                <MetricCards />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                </div>
                <div className="grid gap-4 md:grid-cols-1">
                    <AgentStatusPanel agents={currentAgents} />
                </div>
            </div>
        </div>
    );
}