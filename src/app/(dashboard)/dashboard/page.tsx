"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { TrendingUp, BanknoteArrowUp, Users, TrendingDown, Package, ChartNoAxesColumnIncreasing, ChartPie } from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { DashboardPeriod, dashboardPeriodLabels } from "@/types/dashboard";
import { SelectInput } from "@/components/SelectInput";
import { RevenueExpenseChart } from "./_components/RevenueExpenseChart";
import { ExpensesPieChart } from "./_components/ExpensesPieChart";
import { RecentServiceOrdersCard } from "./_components/RecentServiceOrdersCard";
import { TopUsedPartsCard } from "./_components/TopUsedParts";
import ErrorPage from "@/components/ErrorPage";

export default function DashboardPage() {
  const { dashboardData, isLoading, isError, currentPeriod, changePeriod, refetch } = useDashboard();

  if (isError) {
    <ErrorPage onRetry={refetch} />;
  }

  const generalData = dashboardData?.general;
  const financialData = dashboardData?.financial;
  const operationalData = dashboardData?.operational;

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-primary">Painel de dados</h1>
          <p className="text-muted-foreground">Visão geral do seu negócio</p>
        </div>
        <div className="flex items-center gap-2">
          <SelectInput
            options={Object.entries(dashboardPeriodLabels).map(([key, value]) => ({ label: value, value: key }))}
            value={currentPeriod}
            onChange={(value) => changePeriod(value as DashboardPeriod)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 sm:grid-cols-1">
        <StatCard
          title="Receita Total"
          value={financialData?.totalRevenue ?? 0}
          isLoading={isLoading}
          isMonetary
          icon={<BanknoteArrowUp className="text-muted-foreground/50 h-5" />}
          growthData={generalData?.revenueChange}
          description={`Nos ${dashboardPeriodLabels[currentPeriod].toLowerCase()}`}
        />
        <StatCard
          title="Lucro Líquido"
          value={financialData?.netProfit ?? 0}
          isLoading={isLoading}
          icon={
            financialData && financialData.netProfit < 0 ? (
              <TrendingDown className="text-muted-foreground/50 h-5" />
            ) : (
              <TrendingUp className="text-muted-foreground/50 h-5" />
            )
          }
          isMonetary
          growthData={generalData?.netProfitChange}
          description={`Nos ${dashboardPeriodLabels[currentPeriod].toLowerCase()}`}
          valueClass={(financialData?.netProfit ?? 0) < 0 ? "text-destructive" : "text-green-600"}
        />
        <StatCard
          title="Total de clientes"
          value={generalData?.totalClients ?? 0}
          isLoading={isLoading}
          icon={<Users className="text-muted-foreground/50 h-5" />}
          growthData={generalData?.newClientsChange}
          description={`No total`}
        />
        <StatCard
          title="Estoque Crítico"
          value={operationalData?.lowStockAlert?.count ?? 0}
          isLoading={isLoading}
          icon={<Package className="text-muted-foreground/50 h-5" />}
          description="Com estoque baixo"
          valueClass={(operationalData?.lowStockAlert?.count ?? 0) > 0 ? "text-destructive" : ""}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <div className="md:col-span-4">
          <Card>
            <CardHeader className="mb-2">
              <CardTitle className="text-primary flex items-center">
                <ChartNoAxesColumnIncreasing className="h-4 w-4 mr-2" />
                Receitas x Despesas
              </CardTitle>
              <CardDescription>Gráfico comparativo entre receitas e despesas no período informado</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center text-muted-foreground">
              <RevenueExpenseChart data={financialData?.revenueExpenseChartData ?? []} />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <ChartPie className="h-4 w-4 mr-2" />
                Despesas por categoria
              </CardTitle>
              <CardDescription>Gráfico das categorias de despesa no período informado</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center text-muted-foreground">
              <ExpensesPieChart data={financialData?.expensesByCategory ?? []} />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-7">
        <div className="col-span-4">
          <RecentServiceOrdersCard orders={dashboardData?.operational.recentServiceOrders ?? []} isLoading={isLoading} />
        </div>
        <div className="col-span-3">
          <TopUsedPartsCard
            parts={dashboardData?.operational?.topUsedParts ?? []}
            isLoading={isLoading}
            totalAmount={dashboardData?.operational.totalPartsUsedQuantity ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
