import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vehicleService } from "@/services/vehicle.service";
import { toast } from "sonner";

const VEHICLES_QUERY_KEY = ["vehicles"];
const showError = (err: any) => {
  toast.error(`Erro: ${err.response?.data?.message}`);
};

export const useVehicle = () => {
  const queryClient = useQueryClient();

  const {
    data: vehicles,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: VEHICLES_QUERY_KEY,
    queryFn: vehicleService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: vehicleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      toast.success("Veículo criado.");
    },
    onError: showError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Object }) => vehicleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      toast.success("Veículo atualizado.");
    },
    onError: showError,
  });

  const deleteMutation = useMutation({
    mutationFn: vehicleService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLES_QUERY_KEY });
      toast.success("Veículo removido.");
    },
    onError: showError,
  });

  return {
    vehicles,
    isLoading,
    isError,
    error,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
