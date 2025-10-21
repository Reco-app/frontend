import api from "@/lib/api";
import { Bill, BillSummary, CalendarBill } from "@/types/bill";

export type CreateBillData = Omit<Bill, "id" | "createdAt" | "updatedAt" | "status" | "paymentDate" | "calculatedStatus">;
export type UpdateBillData = Partial<CreateBillData>;
export type MarkPaidData = { paymentDate?: string };

export const billService = {
  getAll: async (): Promise<Bill[]> => (await api.get("/bills")).data,
  getSummary: async (): Promise<BillSummary> => (await api.get("/bills/summary")).data,
  findForCalendar: async (year: number, month: number): Promise<CalendarBill[]> =>
    (await api.get(`/bills/calendar?year=${year}&month=${month}`)).data,
  create: async (data: CreateBillData): Promise<Bill> => (await api.post("/bills", data)).data,
  update: async (id: string, data: UpdateBillData): Promise<Bill> => (await api.patch(`/bills/${id}`, data)).data,
  markAsPaid: async (id: string, data: MarkPaidData): Promise<Bill> => (await api.patch(`/bills/${id}/pay`, data)).data,
  remove: async (id: string): Promise<void> => await api.delete(`/bills/${id}`),
};
