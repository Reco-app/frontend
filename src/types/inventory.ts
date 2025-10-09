import { Car } from "./vehicle";

export interface Part {
  id: string;
  code: string;
  name: string;
  manufacturer: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  minimumStock: number;
  isGeneralUse: boolean;
  createdAt: string;
  updatedAt: string;

  compatibleCars: Car[];

  isLowStock: boolean;
}

export enum MovementType {
  ENTRY = "ENTRY",
  EXIT = "EXIT",
}

export interface InventoryMovement {
  id: string;
  type: MovementType;
  quantity: number;

  reason?: string;

  date: string;

  partId: string;
}
