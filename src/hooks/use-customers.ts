import { customerService } from "@/services/customer.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const CUSTOMERS_QUERY_KEY = ["customers"];

const showError = (err: any) => {
  toast.error(`Erro! ${err.message}`);
};

export const useCustomer = () => {
  const queryClient = useQueryClient();

  const {
    data: customers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: customerService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: customerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.success("Cliente criado com sucesso.");
    },
    onError: showError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Object }) => customerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.success("Cliente atualizado com sucesso.");
    },
    onError: showError,
  });

  const deleteMutation = useMutation({
    mutationFn: customerService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      toast.success("Cliente removido com sucesso.");
    },
    onError: showError,
  });

  return {
    customers,
    isLoading,
    isError,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
