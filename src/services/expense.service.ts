import api from "@/lib/api";
import { Expense, ExpenseSummary } from "@/types/expense";

type CreateExpenseData = Omit<Expense, "id" | "createdAt" | "updatedAt">;
export type UpdateExpenseData = Partial<CreateExpenseData>;

export const expenseService = {
  getAll: async (): Promise<Expense[]> => (await api.get("/expenses")).data,
  getSummary: async (): Promise<ExpenseSummary> => (await api.get("/expenses/summary")).data,
  create: async (data: CreateExpenseData): Promise<Expense> => (await api.post("/expenses", data)).data,
  update: async (id: string, data: UpdateExpenseData): Promise<Expense> => (await api.patch(`/expenses/${id}`, data)).data,
  remove: async (id: string): Promise<void> => await api.delete(`/expenses/${id}`),
};
