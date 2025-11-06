import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { serviceOrderService } from "@/services/service-order.service";
import { StatsPeriod } from "@/types/service-order";

const SO_QUERY_KEY = ["serviceOrders"];

export const useServiceOrders = () => {
  return useQuery({
    queryKey: SO_QUERY_KEY,
    queryFn: serviceOrderService.getAll,
  });
};

export const useServiceOrderById = (id: string) => {
  return useQuery({
    queryKey: [...SO_QUERY_KEY, id],
    queryFn: () => serviceOrderService.getById(id),
    enabled: !!id,
  });
};

export const useServiceOrderMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: serviceOrderService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SO_QUERY_KEY });
      toast.success("Ordem de Serviço criada com sucesso.");
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? "Falha ao criar OS."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => serviceOrderService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: SO_QUERY_KEY });
      queryClient.setQueryData([...SO_QUERY_KEY, data.id], data);
      toast.success("Ordem de Serviço atualizada com sucesso.");
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? "Falha ao atualizar OS."),
  });

  return { createMutation, updateMutation };
};

export const useServiceOrderKpis = (period: StatsPeriod) => {
  return useQuery({
    queryKey: [...SO_QUERY_KEY, "stats", "kpi", period],
    queryFn: () => serviceOrderService.getKpiSummary(period),
  });
};

export const useMostUsedServices = (period: StatsPeriod) => {
  return useQuery({
    queryKey: [...SO_QUERY_KEY, "stats", "most-used-services", period],
    queryFn: () => serviceOrderService.getMostUsedServices(period),
  });
};

export const useServicesPerVehicle = (period: StatsPeriod) => {
  return useQuery({
    queryKey: [...SO_QUERY_KEY, "stats", "services-per-vehicle", period],
    queryFn: () => serviceOrderService.getServicesPerVehicle(period),
  });
};
