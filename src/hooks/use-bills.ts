import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { billService } from "@/services/bill.service";
import { UpdateBillData, MarkPaidData } from "@/services/bill.service"; // Assuming these types are exported

const BILL_KEY = ["bills"];

/**
 * Hook unificado para gerenciar todas as operações CRUD de Boletos/Contas.
 */
export const useBills = () => {
  const queryClient = useQueryClient();

  // QUERY: Buscar todos os boletos
  const {
    data: bills,
    isLoading,
    isError,
  } = useQuery({
    queryKey: BILL_KEY,
    queryFn: billService.getAll,
  });

  // QUERY: Buscar o resumo dos boletos
  const { data: summary } = useQuery({
    queryKey: [...BILL_KEY, "summary"],
    queryFn: billService.getSummary,
  });

  // MUTATION: Criar um boleto
  const createMutation = useMutation({
    mutationFn: billService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILL_KEY });
      toast.success("Boleto registrado com sucesso.");
    },
    onError: (err: any) => {
      console.error("Erro ao criar boleto:", err);
      toast.error(err.response?.data?.message ?? "Falha ao registrar boleto.");
    },
  });

  // MUTATION: Atualizar um boleto
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBillData }) => billService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILL_KEY });
      toast.success("Boleto atualizado com sucesso.");
    },
    onError: (err: any) => {
      console.error("Erro ao atualizar boleto:", err);
      toast.error(err.response?.data?.message ?? "Falha ao atualizar boleto.");
    },
  });

  // MUTATION: Deletar um boleto
  const deleteMutation = useMutation({
    mutationFn: billService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILL_KEY });
      toast.success("Boleto removido com sucesso.");
    },
    onError: (err: any) => {
      console.error("Erro ao remover boleto:", err);
      toast.error(err.response?.data?.message ?? "Falha ao remover boleto.");
    },
  });

  // MUTATION: Marcar um boleto como pago
  const markAsPaidMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MarkPaidData }) => billService.markAsPaid(id, data),
    onSuccess: () => {
      // Invalida todas as queries de boletos (lista, resumo, calendário)
      queryClient.invalidateQueries({ queryKey: BILL_KEY });
      toast.success("Boleto marcado como pago.");
    },
    onError: (err: any) => {
      console.error("Erro ao marcar boleto como pago:", err);
      toast.error(err.response?.data?.message ?? "Falha ao marcar como pago.");
    },
  });

  return {
    bills,
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
    markAsPaidMutation: {
      mutate: markAsPaidMutation.mutate,
      isPending: markAsPaidMutation.isPending,
    },
  };
};

/**
 * Hook específico para buscar boletos para o calendário.
 */
export const useBillCalendar = (year: number, month: number) => {
  return useQuery({
    queryKey: [...BILL_KEY, "calendar", year, month],
    queryFn: () => billService.findForCalendar(year, month),
    enabled: !!year && !!month && month >= 1 && month <= 12,
    staleTime: 1000 * 60 * 5,
  });
};
