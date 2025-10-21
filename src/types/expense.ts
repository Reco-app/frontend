export interface Expense {
  id: string;
  name: string;
  category: string;
  value: number;
  date: string;
  isRecurring: boolean;
  observations?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseSummary {
  summary: {
    total: number;
    recurringCount: number;
    recurringTotal: number;
    singleCount: number;
    singleTotal: number;
  };
  period: {
    initialDate: Date;
    endDate: Date;
  };
}
