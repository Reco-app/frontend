import api from "@/lib/api";
import { DashboardData, DashboardPeriod } from "@/types/dashboard";

export const dashboardService = {
  getDashboardData: async (period: DashboardPeriod): Promise<DashboardData> => {
    const { data } = await api.get("/dashboard", { params: { period } });
    return data;
  },
};
