import api from "@/lib/api";
import { InventoryMovement } from "@/types/inventory";

type CreateMovementData = {
  partId: string;
  type: "ENTRY" | "EXIT";
  quantity: number;
  reason?: string;
};

export const inventoryMovementService = {
  create: async (data: CreateMovementData): Promise<InventoryMovement> => (await api.post("/inventory-movements", data)).data,
  findAllByPart: async (partId: string): Promise<InventoryMovement[]> => (await api.get(`/parts/${partId}/movements`)).data,
};
