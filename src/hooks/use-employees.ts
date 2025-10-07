import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { employeeService } from "@/services/employee.service";

const EMPLOYEES_QUERY_KEY = ["employees"];

const showError = (err: any) => {
  toast.error(`Erro! ${err.message}`);
};

export const useEmployee = () => {
  const queryClient = useQueryClient();

  const {
    data: employees,
    isLoading,
    isError,
  } = useQuery({
    queryKey: EMPLOYEES_QUERY_KEY,
    queryFn: employeeService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      toast.success("Funcionário criado com sucesso.");
    },
    onError: showError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Object }) => employeeService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      toast.success("Funcionário atualizado com sucesso.");
    },
    onError: showError,
  });

  const deleteMutation = useMutation({
    mutationFn: employeeService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEES_QUERY_KEY });
      toast.success("Funcionário removido com sucesso.");
    },
    onError: showError,
  });

  return {
    employees,
    isLoading,
    isError,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
