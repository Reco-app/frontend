import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/finance.service";

const FINANCE_DASHBOARD_KEY = ["financeDashboard"];

export const useFinanceDashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: FINANCE_DASHBOARD_KEY,
    queryFn: financeService.getDashboardData,
  });

  return {
    dashboardData: data,
    isLoading,
    isError,
    error,
  };
};
