import api from "@/lib/api";
import { Part } from "@/types/inventory";

type CreatePartData = Omit<Part, "id" | "createdAt" | "updatedAt" | "quantity" | "movements" | "isLowStock"> & { initialQuantity: number };
type UpdatePartData = Partial<Omit<CreatePartData, "initialQuantity">>;

export const partService = {
  getAll: async (): Promise<Part[]> => (await api.get("/parts")).data,
  getLowStockSummary: async (): Promise<{ count: number }> => (await api.get("/parts/low-stock-summary")).data,
  create: async (data: CreatePartData): Promise<Part> => (await api.post("/parts", data)).data,
  update: async (id: string, data: UpdatePartData): Promise<Part> => {
    console.log("Data: ", data);
    return (await api.patch(`/parts/${id}`, data)).data;
  },
  remove: async (id: string): Promise<void> => await api.delete(`/parts/${id}`),
};
