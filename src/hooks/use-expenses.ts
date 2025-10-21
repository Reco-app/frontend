import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { expenseService } from "@/services/expense.service";
import { UpdateExpenseData } from "@/services/expense.service"; // Assuming UpdateExpenseData is exported

const EXPENSE_KEY = ["expenses"];

/**
 * Hook unificado para gerenciar todas as operações CRUD de Despesas.
 */
export const useExpenses = () => {
  const queryClient = useQueryClient();

  // QUERY: Buscar todas as despesas
  const {
    data: expenses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: EXPENSE_KEY,
    queryFn: expenseService.getAll,
  });

  // QUERY: Buscar o resumo das despesas
  const { data: summary } = useQuery({
    queryKey: [...EXPENSE_KEY, "summary"],
    queryFn: expenseService.getSummary,
  });

  // MUTATION: Criar uma despesa
  const createMutation = useMutation({
    mutationFn: expenseService.create,
    onSuccess: () => {
      // Invalida a query principal e a de resumo para buscar dados atualizados
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEY });
      toast.success("Despesa registrada com sucesso.");
    },
    onError: (err: any) => {
      console.error("Erro ao criar despesa:", err);
      toast.error(err.response?.data?.message ?? "Falha ao registrar despesa.");
    },
  });

  // MUTATION: Atualizar uma despesa
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExpenseData }) => expenseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEY });
      toast.success("Despesa atualizada com sucesso.");
    },
    onError: (err: any) => {
      console.error("Erro ao atualizar despesa:", err);
      toast.error(err.response?.data?.message ?? "Falha ao atualizar despesa.");
    },
  });

  // MUTATION: Deletar uma despesa
  const deleteMutation = useMutation({
    mutationFn: expenseService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEY });
      toast.success("Despesa removida com sucesso.");
    },
    onError: (err: any) => {
      console.error("Erro ao remover despesa:", err);
      toast.error(err.response?.data?.message ?? "Falha ao remover despesa.");
    },
  });

  return {
    expenses,
    summary,
    isLoading,
    isError,
    createMutation: {
      mutate: createMutation.mutate,
      isPending: createMutation.isPending,
    },
    updateMutation: {
      mutate: updateMutation.mutate,
      isPending: updateMutation.isPending,
    },
    deleteMutation: {
      mutate: deleteMutation.mutate,
      isPending: deleteMutation.isPending,
    },
  };
};
