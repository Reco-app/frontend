import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { partService } from "@/services/part.service";

const PARTS_QUERY_KEY = ["parts"];

const showError = (err: any) => {
  toast.error(`Erro: ${err.response?.data?.message}`);
};

export const useParts = () => {
  const queryClient = useQueryClient();

  const {
    data: parts,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: PARTS_QUERY_KEY,
    queryFn: partService.getAll,
  });

  const { data: stockSummary } = useQuery({
    queryKey: ["parts", "summary"],
    queryFn: partService.getStockSummary,
  });

  const createMutation = useMutation({
    mutationFn: partService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["parts", "summary"] });
      toast.success("Peça criada com sucesso.");
    },
    onError: showError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => {
      const { initialQuantity, ...dataWithoutInitialQuantity } = data;
      return partService.update(id, { ...dataWithoutInitialQuantity, id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["parts", "summary"] });
      toast.success("Peça atualizada com sucesso.");
    },
    onError: showError,
  });

  const deleteMutation = useMutation({
    mutationFn: partService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["parts", "summary"] });
      toast.success("Peça removida com sucesso.");
    },
    onError: showError,
  });

  return { parts, isLoading, isError, refetch, stockSummary, createMutation, updateMutation, deleteMutation };
};
