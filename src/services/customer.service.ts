import api from "@/lib/api";
import { Customer } from "@/types/customer";

type CreateCustomerData = Omit<Customer, "id" | "createdAt" | "updatedAt" | "vehicles">;
type UpdateCustomerData = Partial<CreateCustomerData>;

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const { data } = await api.get("/customers");
    return data.map((c: Customer) => ({ ...c, vehicles: c.vehicles || [] }));
  },

  create: async (customerData: CreateCustomerData): Promise<Customer> => {
    const { data } = await api.post("/customers", customerData);
    return data;
  },

  update: async (id: string, customerData: UpdateCustomerData): Promise<Customer> => {
    const { data } = await api.patch(`/customers/${id}`, customerData);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },
};
