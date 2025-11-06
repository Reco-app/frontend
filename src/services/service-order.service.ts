import api from "@/lib/api";
import { MostUsedServiceDto, ServiceOrder, ServiceOrderKpiDto, ServicesPerVehicleDto, StatsPeriod } from "@/types/service-order";

type CreateServiceOrderData = any;
type UpdateServiceOrderData = Partial<CreateServiceOrderData>;

export const serviceOrderService = {
  getAll: async (): Promise<ServiceOrder[]> => (await api.get("/service-orders")).data,
  getById: async (id: string): Promise<ServiceOrder> => (await api.get(`/service-orders/${id}`)).data,
  create: async (data: CreateServiceOrderData): Promise<ServiceOrder> => (await api.post("/service-orders", data)).data,
  update: async (id: string, data: UpdateServiceOrderData): Promise<ServiceOrder> => (await api.patch(`/service-orders/${id}`, data)).data,
  getKpiSummary: async (period: StatsPeriod): Promise<ServiceOrderKpiDto> => {
    return (await api.get(`/service-orders/stats?period=${period}`)).data;
  },
  getMostUsedServices: async (period: StatsPeriod): Promise<MostUsedServiceDto[]> => {
    return (await api.get(`/service-orders/stats/most-used-services?period=${period}`)).data;
  },
  getServicesPerVehicle: async (period: StatsPeriod): Promise<ServicesPerVehicleDto[]> => {
    return (await api.get(`/service-orders/stats/services-per-vehicle?period=${period}`)).data;
  },
};
