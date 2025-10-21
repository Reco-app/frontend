import { PaymentStatus } from "./service-order";

export enum BillStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export interface Bill {
  id: string;
  description: string;
  supplier?: string;
  value: number;
  emissionDate: string;
  dueDate: string;
  barcode?: string;
  observations?: string;
  status: BillStatus.PENDING | BillStatus.PAID;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;

  calculatedStatus: BillStatus;
}

export interface BillSummary {
  summary: {
    totalPendingValue: number;
    pendingCount: number;
    overdueCount: number;
    overdueValue: number;
    paidCount: number;
    paidTotal: number;
    totalBills: number;
  };
  period: {
    initialDate: Date;
    endDate: Date;
  };
}

export interface CalendarBill {
  id: string;
  description: string;
  dueDate: string;
  value: number;
  calculatedStatus: BillStatus;
}
