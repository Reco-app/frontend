import api from "@/lib/api";
import { Car, Vehicle } from "@/types/vehicle";

type CreateVehicleData = Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "owner">;
type UpdateVehicleData = Partial<CreateVehicleData>;

export const vehicleService = {
  seed: async () => {
    const { data } = await api.get("/cars/seed");
    return data;
  },

  getAll: async (): Promise<Vehicle[]> => {
    const { data } = await api.get("/vehicles");
    return data;
  },

  create: async (vehicleData: CreateVehicleData): Promise<Vehicle> => {
    const { data } = await api.post("/vehicles", vehicleData);
    return data;
  },

  update: async (id: string, vehicleData: UpdateVehicleData): Promise<Vehicle> => {
    const { data } = await api.patch(`/vehicles/${id}`, vehicleData);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },
};
