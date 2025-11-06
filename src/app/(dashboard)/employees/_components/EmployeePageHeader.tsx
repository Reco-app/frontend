"use client";

import { StatCard } from "@/components/StatCard";
import { useEmployeeStats } from "@/hooks/use-employees";
import { formatCurrency } from "@/lib/formatters";
import { getWeeksInMonth } from "date-fns";
import { HandCoins, IdCardLanyard, Wrench } from "lucide-react";

export default function EmployeePageHeader() {
  const { employeeStatsData: data, isLoadingStats: isLoading } = useEmployeeStats();

  const monthlyPayroll = getWeeksInMonth(new Date()) * (data?.currentWeeklyPayroll ?? 0);
  return (
    <>
      <div className="my-8">
        <h1 className="text-2xl font-bold text-primary">Gerencimento de funcionários</h1>
        <p className="text-muted-foreground">Obtenha informações e realize o controle da equipe</p>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4">
        <StatCard
          title="Funcionários ativos"
          value={data?.totalActiveEmployees ?? 0}
          isLoading={isLoading}
          icon={<IdCardLanyard className="h-5 text-muted-foreground" />}
          description="Número total"
        />
        <StatCard
          title="Folha de pagamento"
          value={data?.currentWeeklyPayroll ?? 0}
          secondaryValue={`${formatCurrency(monthlyPayroll)} mensal`}
          isLoading={isLoading}
          icon={<HandCoins className="h-5 text-muted-foreground" />}
          isMonetary
          description="Nesta semana"
        />
        <StatCard
          title="Comissão total"
          value={data?.totalWeeklyCommission ?? 0}
          secondaryValue={`${formatCurrency(data?.totalServiceValue ?? 0)} em serviços`}
          icon={<Wrench className="h-5 text-muted-foreground" />}
          isLoading={isLoading}
          isMonetary
          description="Nesta semana"
        />
      </div>
    </>
  );
}
