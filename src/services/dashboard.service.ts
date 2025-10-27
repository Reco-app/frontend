import api from "@/lib/api";
import { DashboardData } from "@/types/dashboard";
import { DashboardPeriod } from "@/types/dashboard-period.enum";

export const dashboardService = {
  getDashboardData: async (period: DashboardPeriod): Promise<DashboardData> => {
    const { data } = await api.get("/dashboard", { params: { period } });
    return data;
  },
};
