"use client";

import { StatCard } from "@/components/StatCard";
import { useMostUsedServices, useServiceOrderKpis, useServicesPerVehicle } from "@/hooks/use-service-orders";
import { StatsPeriod } from "@/types/service-order";
import { BarChart3, Car, List, TrendingUp, Wrench } from "lucide-react";
import { useState } from "react";
import { ServiceOrderStatsList } from "./ServiceOrderStatsList";
import { PeriodSelector } from "@/components/PeriodSelector";

export function ServiceOrdersStats() {
  const [period, setPeriod] = useState<StatsPeriod>(StatsPeriod.ALL);

  const { data: kpis, isLoading: isLoadingKpis } = useServiceOrderKpis(period);
  const { data: mostUsedServices, isLoading: isLoadingServices } = useMostUsedServices(period);
  const { data: servicesPerVehicle, isLoading: isLoadingVehicles } = useServicesPerVehicle(period);

  return (
    <div className="space-y-6 mb-2">
      <h1 className="text-primary mb-0 text-xl font-bold">Ordens de Serviço</h1>
      <PeriodSelector onSelectPeriod={(v) => setPeriod(v as StatsPeriod)} width="400px" />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Faturamento"
          value={kpis?.totalRevenue ?? 0}
          isMonetary
          icon={<TrendingUp className="h-5 w-5 text-muted-foreground" />}
          isLoading={isLoadingKpis}
          description="Apurados no período"
        />
        <StatCard
          title="Ordens Finalizadas"
          value={kpis?.totalOrders ?? 0}
          icon={<List className="h-5 w-5 text-muted-foreground" />}
          isLoading={isLoadingKpis}
          description="Realizadas no período"
        />
        <StatCard
          title="Ticket Médio"
          value={kpis?.averageTicket ?? 0}
          isMonetary
          icon={<BarChart3 className="h-5 w-5 text-muted-foreground" />}
          isLoading={isLoadingKpis}
          description="Valor médio por serviço"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ServiceOrderStatsList
          title="Serviços Mais Realizados"
          data={mostUsedServices}
          isLoading={isLoadingServices}
          icon={<Wrench className="h-5 w-5 text-muted-foreground" />}
        />
        <ServiceOrderStatsList
          title="Veículos Mais Atendidos"
          data={servicesPerVehicle}
          isLoading={isLoadingVehicles}
          icon={<Car className="h-5 w-5 text-muted-foreground" />}
        />
      </div>
    </div>
  );
}
