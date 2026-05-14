"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { partService } from "@/services/part.service";
import { MostUsedPartDto, Period } from "@/types/inventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Spinner from "@/components/Spinner";
import { Cog, Package } from "lucide-react";
import { PeriodSelector } from "@/components/PeriodSelector";
import { StatsPeriod } from "@/types/service-order";

export function MostUsedParts() {
  const [period, setPeriod] = useState<Period>(Period.ALL);

  const { data, isLoading, error } = useQuery<MostUsedPartDto[], Error>({
    queryKey: ["parts", "most-used", period],
    queryFn: () => partService.getMostUsedParts(period),
  });

  const handlePeriodChange = (value: string) => {
    setPeriod(value as Period);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col items-start justify-between">
        <CardTitle className="text-sm text-primary mb-2">Peças mais utilizadas</CardTitle>
        <div className="w-[100%]">
          <PeriodSelector period={StatsPeriod.ALL} onSelectPeriod={(v) => setPeriod(v)} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && <Spinner />}
        {error && <p className="text-destructive">Erro ao carregar dados.</p>}
        {data && data.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Package className="w-6 h-6 mb-2" />
            <p className="text-sm">Nenhuma peça foi utilizada neste período</p>
          </div>
        )}
        {data && data.length > 0 && (
          <ul>
            {data.map((part) => (
              <li key={part.partId} className="flex items-center justify-between px-4 py-2 rounded-md hover:bg-accent/80">
                <div className="flex items-center">
                  <Cog className="w-4 h-4 mr-3 text-primary/40" />
                  <span className="text-sm text-primary font-medium">{part.partName}</span>
                </div>
                <span className="text-md font-bold text-primary">
                  {part.totalUsed}
                  <span className="text-sm font-normal text-muted-foreground ml-1">unid.</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
