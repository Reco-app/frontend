import { PaymentStatus } from "./service-order"; // Reutilize o enum

export interface ReceivableItem {
  id: string;
  osNumber: string;
  customerName: string;
  vehiclePlate: string;
  conclusionDate: string;
  value: number;
  status: PaymentStatus;
}

export interface RecentExpenseItem {
  id: string;
  name: string;
  category: string;
  value: number;
  date: string;
  isRecurring: boolean;
}

export interface DashboardData {
  totalRevenueReceived: number;
  totalExpenses: number;
  netProfit: number;
  totalReceivablesAmount: number;
  receivablesCount: number;
  recentReceivables: ReceivableItem[];
  recentExpenses: RecentExpenseItem[];
}
