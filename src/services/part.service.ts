import api from "@/lib/api";
import { MostUsedPartDto, Part, Period, StockSummaryDto } from "@/types/inventory";

type CreatePartData = Omit<Part, "id" | "createdAt" | "updatedAt" | "quantity" | "movements" | "isLowStock"> & { initialQuantity: number };
type UpdatePartData = Partial<Omit<CreatePartData, "initialQuantity">>;

export const partService = {
  getAll: async (): Promise<Part[]> => (await api.get("/parts")).data,
  getStockSummary: async (): Promise<StockSummaryDto> => {
    return (await api.get("/parts/summary")).data;
  },

  getMostUsedParts: async (period: Period): Promise<MostUsedPartDto[]> => {
    return (await api.get(`/parts/most-used?period=${period}`)).data;
  },
  create: async (data: CreatePartData): Promise<Part> => (await api.post("/parts", data)).data,
  update: async (id: string, data: UpdatePartData): Promise<Part> => {
    return (await api.patch(`/parts/${id}`, data)).data;
  },
  remove: async (id: string): Promise<void> => await api.delete(`/parts/${id}`),
};
