import { useQuery } from "@tanstack/react-query";
import { carService } from "@/services/car.service";

const FIPE_CARS_QUERY_KEY = ["fipeCars"];

export const useFipeCars = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: FIPE_CARS_QUERY_KEY,
    queryFn: carService.getAll,
    staleTime: 1000 * 60 * 60 * 24,
    refetchOnWindowFocus: false,
  });

  return {
    fipeCars: data,
    isLoadingCars: isLoading,
    isErrorCars: isError,
  };
};
