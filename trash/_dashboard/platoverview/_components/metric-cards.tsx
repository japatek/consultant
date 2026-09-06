'use client'
import { useRouter } from "next/navigation";
import { DollarSign, TrendingUp, UserPlus, Users, Waves, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function MetricCards() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-3 gap-4 xl:grid-cols-3 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card *:data-[slot=card]:hover:bg-linear-to-b *:data-[slot=card]:transition-all *:data-[slot=card]:duration-500">
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <DollarSign className="size-4" />
            </div>
          </CardTitle>
          <CardDescription>Credit Balance</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">$1,250.00</div>
          </div>
          <p className="text-muted-foreground text-sm underline">Turn On Auto Billing</p>
          <Button color={2}>Add Funds</Button>
        </CardContent>
      </Card>

      <Card
        className="cursor-pointer hover:border-primary/50 transition-all duration-200">
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <UserPlus className="size-4" />
            </div>
          </CardTitle>
          <CardAction
            className="flex items-center gap-1 text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors"
            onClick={() => router.push('/dashboard/usage/viewtoken')}
          >
            Detail <ArrowRight className="size-4" />
          </CardAction>
          <CardDescription>Spend this month</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">$1,234</div>
            <Badge variant="constructive">
              <TrendingUp className="size-3" />
              +20%
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">Based on the last month</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
              <Waves className="size-4" />
            </div>
          </CardTitle>
          <CardAction
            className="flex items-center gap-1 text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors"
            onClick={() => router.push('/dashboard/usage/caching')}
          >
            Detail <ArrowRight className="size-4" />
          </CardAction>
          <CardDescription>Prompt Caching</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-medium text-3xl tabular-nums leading-none tracking-tight">-</div>
          </div>
          <p className="text-muted-foreground text-sm">reused tokens</p>
          <Button color={2}>Set-Up</Button>
        </CardContent>
      </Card>
    </div>
  );
}
