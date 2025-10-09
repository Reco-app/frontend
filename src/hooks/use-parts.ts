import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { partService } from "@/services/part.service";

const PARTS_QUERY_KEY = ["parts"];

export const useParts = () => {
  const queryClient = useQueryClient();

  const {
    data: parts,
    isLoading,
    isError,
  } = useQuery({
    queryKey: PARTS_QUERY_KEY,
    queryFn: partService.getAll,
  });

  const { data: lowStockSummary } = useQuery({
    queryKey: ["parts", "lowStockSummary"],
    queryFn: partService.getLowStockSummary,
  });

  const createMutation = useMutation({
    mutationFn: partService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTS_QUERY_KEY });
      toast.success("Peça criada com sucesso.");
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? "Falha ao criar peça."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: any) => {
      const { initialQuantity, ...dataWithoutInitialQuantity } = data;
      return partService.update(id, { ...dataWithoutInitialQuantity, id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTS_QUERY_KEY });
      toast.success("Peça atualizada com sucesso.");
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? "Falha ao criar peça."),
  });

  const deleteMutation = useMutation({
    mutationFn: partService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PARTS_QUERY_KEY });
      toast.success("Peça removida com sucesso.");
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? "Falha ao criar peça."),
  });

  return { parts, isLoading, isError, lowStockSummary, createMutation, updateMutation, deleteMutation };
};
