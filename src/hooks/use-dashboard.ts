import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardPeriod } from "@/types/dashboard";

const DASHBOARD_KEY = ["dashboard"];

export const useDashboard = () => {
  const [period, setPeriod] = React.useState<DashboardPeriod>(DashboardPeriod.LAST_7_DAYS);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [...DASHBOARD_KEY, period],
    queryFn: () => dashboardService.getDashboardData(period),
    staleTime: 1000 * 60 * 5,
  });

  const changePeriod = (newPeriod: DashboardPeriod) => {
    setPeriod(newPeriod);
  };

  return {
    dashboardData: data,
    isLoading,
    isError,
    error,
    currentPeriod: period,
    changePeriod,
  };
};
