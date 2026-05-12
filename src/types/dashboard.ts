import { ServiceOrderStatus } from "./service-order";

/** Tipo para agregação de despesas por categoria */
export interface ExpensesByCategoryItem {
  category: string;
  total: number;
}

/** Tipo para os dados do gráfico Receita x Despesa */
export interface RevenueExpenseChartDataItem {
  name: string;
  revenue: number;
  expense: number;
}

// --- TIPOS EXISTENTES (Mantidos para clareza) ---

/** Tipo para distribuição de status de OS */
export interface StatusDistributionItem {
  status: ServiceOrderStatus;
  _count: { status: number };
}

/** Tipo para item no ranking de produtividade */
export interface ProductivityRankingItem {
  employeeName: string;
  count: number;
}

/** Tipo para uma peça no alerta de estoque baixo */
export interface LowStockPart {
  id: string;
  name: string;
  quantity: number;
  minimumStock: number;
}

export interface TopUsedPartItem {
  partId: string;
  partName: string;
  partCode: string;
  unitPrice: number;
  totalQuantityUsed: number;
}

export interface RecentServiceOrderItem {
  id: string;
  customer: string;
  vehicle: string;
  status: ServiceOrderStatus;
  totalAmount: number | null;
  createdAt: string;
}

export interface DashboardData {
  general: {
    totalRevenue: number;
    revenueChange: number | null | typeof Infinity | typeof Number.NEGATIVE_INFINITY;
    netProfit: number;
    netProfitChange: number | null | typeof Infinity | typeof Number.NEGATIVE_INFINITY;
    averageTicket: number;
    completionRate: number;
    totalClients: number;
    newClientsChange: number | null | typeof Infinity | typeof Number.NEGATIVE_INFINITY;
    revenueExpenseChartData: RevenueExpenseChartDataItem[];
    recentServiceOrders: RecentServiceOrderItem[];
  };
  financial: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    averageTicket: number;
    totalReceivablesAmount: number;
    receivablesCount: number;
    expensesByCategory: ExpensesByCategoryItem[];
    revenueExpenseChartData: RevenueExpenseChartDataItem[];
  };
  operational: {
    totalOrdersCreated: number;
    finishedOrdersCount: number;
    completionRate: number;
    inProgressOrdersCount: number;
    attendedVehiclesCount: number;
    statusDistribution: StatusDistributionItem[];
    lowStockAlert: {
      count: number;
      parts: LowStockPart[];
    };
    topUsedParts: TopUsedPartItem[];
    recentServiceOrders: RecentServiceOrderItem[];
    totalPartsUsedQuantity: number;
  };
  team: {
    totalEmployees: number;
    averageOsPerEmployee: number;
    productivityRanking: ProductivityRankingItem[];
  };
}

export enum DashboardPeriod {
  LAST_7_DAYS = "LAST_7_DAYS",
  LAST_30_DAYS = "LAST_30_DAYS",
  LAST_YEAR = "LAST_YEAR",
  ALL_TIME = "ALL_TIME",
}

export const dashboardPeriodLabels: Record<DashboardPeriod, string> = {
  [DashboardPeriod.LAST_7_DAYS]: "Últimos 7 dias",
  [DashboardPeriod.LAST_30_DAYS]: "Últimos 30 dias",
  [DashboardPeriod.LAST_YEAR]: "Último Ano",
  [DashboardPeriod.ALL_TIME]: "Todo o Período",
};
