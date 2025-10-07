import api from "@/lib/api";
import { Car } from "@/types/vehicle";

export const carService = {
  getAll: async (): Promise<Car[]> => {
    const { data } = await api.get("/cars");
    return data;
  },

  seed: async () => {
    const { data } = await api.post("/cars/seed");
    return data;
  },
};
