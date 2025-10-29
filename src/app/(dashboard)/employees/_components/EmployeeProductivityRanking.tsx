"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IdCardLanyard } from "lucide-react";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useEmployeeStats } from "@/hooks/use-employees";
import { useRouter } from "next/navigation";

export function EmployeeProductivityRanking() {
  const { isLoadingStats: isLoading, employeeStatsData: data } = useEmployeeStats();
  const router = useRouter();

  const productivityRanking = data?.productivityRanking ?? [];

  const totalServices = React.useMemo(() => productivityRanking.reduce((sum, item) => sum + item.serviceCount, 0), [data]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between w-[100%]">
        <div>
          <CardTitle className="text-sm font-medium text-primary flex items-center">
            <IdCardLanyard className="mr-2 h-4 w-4" /> Produtividade
          </CardTitle>
          <CardDescription>Funcionários com mais serviços no período</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3 pt-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-part-${index}`} className="flex justify-between items-center">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-4 w-1/5" />
              </div>
            ))}
          </div>
        ) : productivityRanking.length > 0 ? (
          <div className="space-y-3 pt-2">
            {productivityRanking.map((employee, index) => (
              <React.Fragment key={index}>
                <div
                  className="flex justify-between items-center text-sm hover:cursor-pointer"
                  onClick={() => router.push(`/employees/${employee.employeeId}`)}
                >
                  <div className="truncate text-muted-foreground w-[100%]">
                    <span className="mr-2 font-semibold border-muted-foreground/40 pr-2">
                      {index + 1}. {employee.employeeName}
                    </span>
                  </div>
                  <p className="font-semibold text-primary flex items-center">
                    {employee.serviceCount}
                    <span className="text-xs ml-1 text-muted-foreground font-normal">serviço(s)</span>
                  </p>
                </div>
                <Progress className="[&>*]:bg-blue-500 mt-2" value={(employee.serviceCount / totalServices) * 100} />
                {index < productivityRanking.length - 1 && <Separator className="mt-4" />}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-10">Nenhuma peça utilizada registrada no período selecionado.</p>
        )}
      </CardContent>
    </Card>
  );
}
