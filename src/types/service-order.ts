import { Customer } from "./customer";
import { Part } from "./inventory";
import { Vehicle } from "./vehicle";

export enum ServiceOrderStatus {
  AWAITING_APPROVAL = "AWAITING_APPROVAL",
  APPROVED = "APPROVED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
  CANCELED = "CANCELED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PARTIAL = "PARTIAL",
  PAID = "PAID",
}

export enum PaymentMethod {
  DEBIT_CARD = "DEBIT_CARD",
  CREDIT_CARD = "CREDIT_CARD",
  CASH = "CASH",
  PIX = "PIX",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export enum StatsPeriod {
  WEEK = "WEEK",
  MONTH = "MONTH",
  ALL = "ALL",
}

export interface PartOnService {
  quantityUsed: number;
  part: Part;
}

export interface Service {
  id: string;
  name: string;
  laborCost: number;
  observations?: string;
  employee: { name: string };
  partsUsed: PartOnService[];
  createdAt: Date;
  updatedAt: Date;
  serviceOrder: ServiceOrder;
}

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  installments?: number;
  date: string;
}

export interface ServiceOrder {
  id: string;
  entryDate: string;
  exitDate?: string;
  problemDescription?: string;
  status: ServiceOrderStatus;
  totalAmount?: number;
  discount: number;
  createdAt: string;
  updatedAt: string;

  customer: Customer;
  vehicle: Vehicle;
  services: Service[];
  payments: Payment[];

  paymentStatus: PaymentStatus;
}

export interface ServiceOrderKpiDto {
  totalOrders: number;
  totalRevenue: number;
  averageTicket: number;
}

export interface MostUsedServiceDto {
  serviceName: string;
  count: number;
}

export interface ServicesPerVehicleDto {
  vehicleName: string;
  count: number;
}
