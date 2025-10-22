import api from "@/lib/api";
import { DashboardData } from "@/types/finance";

export const financeService = {
  getDashboardData: async (): Promise<DashboardData> => {
    const { data } = await api.get("/finance/dashboard");
    return data;
  },
};
