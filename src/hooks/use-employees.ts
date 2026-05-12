import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { employeeService } from "@/services/employee.service";
import React from "react";
import { StatsPeriod } from "@/types/service-order";

const EMPLOYEES_QUERY_KEY = ["employees"];

const showError = (err: any) => {
  toast.error(`Erro! ${err.message}`);
};

const DASHBOARD_KEY = ["employee-stats"];

export const useEmployeeStats = () => {
  const [period, setPeriod] = React.useState<StatsPeriod>(StatsPeriod.WEEK);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch: refetchStats,
  } = useQuery({
    queryKey: [...DASHBOARD_KEY, period],
    queryFn: () => employeeService.getStats(period),
    staleTime: 1000 * 60 * 5,
  });

  const changePeriod = (newPeriod: StatsPeriod) => {
    setPeriod(newPeriod);
  };

  return {
    employeeStatsData: data,
    isLoadingStats: isLoading,
    isError,
    refetchStats,
    error,
    currentPeriod: period,
    changePeriod,
  };
};

export const useEmployee = () => {
  const queryClient = useQueryClient();

  const {
    data: employees,
    isLoading,
    isError,
    refetch: refetchData,
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
    mutationFn: ({ id, ...data }: any) => employeeService.update(id, data),
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
    refetchData,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
