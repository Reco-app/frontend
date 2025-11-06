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

export enum Period {
  WEEK = "WEEK",
  MONTH = "MONTH",
  ALL = "ALL",
}

export interface InventoryMovement {
  id: string;
  type: MovementType;
  quantity: number;
  reason?: string;
  date: string;
  partId: string;
}

export interface StockSummaryDto {
  totalItems: number;
  totalStockValue: number;
  lowStockItemsCount: number;
  lowStockItemsValue: number;
}

export interface MostUsedPartDto {
  partId: string;
  partName: string;
  totalUsed: number;
}
