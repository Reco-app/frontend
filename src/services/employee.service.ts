import api from "@/lib/api";
import { Employee, EmployeeStats } from "@/types/employee";
import { StatsPeriod } from "@/types/service-order";

type CreateEmployeeData = Omit<Employee, "id" | "createdAt" | "updatedAt">;
type UpdateEmployeeData = Partial<CreateEmployeeData>;

export const employeeService = {
  getStats: async (period: StatsPeriod): Promise<EmployeeStats> => {
    const { data } = await api.get("/employees/stats", { params: { period } });
    return data;
  },

  getAll: async (): Promise<Employee[]> => {
    const { data } = await api.get("/employees");
    return data;
  },

  create: async (employeeData: CreateEmployeeData): Promise<Employee> => {
    const { data } = await api.post("/employees", employeeData);
    return data;
  },

  update: async (id: string, employeeData: UpdateEmployeeData): Promise<Employee> => {
    const { data } = await api.patch(`/employees/${id}`, employeeData);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },
};
