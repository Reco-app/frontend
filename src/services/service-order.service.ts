import api from "@/lib/api";
import { ServiceOrder } from "@/types/service-order";

type CreateServiceOrderData = any;
type UpdateServiceOrderData = Partial<CreateServiceOrderData>;

export const serviceOrderService = {
  getAll: async (): Promise<ServiceOrder[]> => (await api.get("/service-orders")).data,
  getById: async (id: string): Promise<ServiceOrder> => (await api.get(`/service-orders/${id}`)).data,
  create: async (data: CreateServiceOrderData): Promise<ServiceOrder> => (await api.post("/service-orders", data)).data,
  update: async (id: string, data: UpdateServiceOrderData): Promise<ServiceOrder> => (await api.patch(`/service-orders/${id}`, data)).data,
};
