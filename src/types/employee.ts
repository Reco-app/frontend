import { Service } from "./service-order";

export enum EmployeeRole {
  ATTENDANT = "Atendente",
  MECHANIC = "Mecânico",
}

export type Employee = {
  id: string;
  name: string;
  documentId?: string;
  phone: string;
  salary: number;
  address?: string;
  updatedAt?: string | Date;
  role: EmployeeRole | string;
  services: Service[];
};

export interface ProductivityRankingItem {
  employeeId: string;
  employeeName: string;
  serviceCount: number;
}

export interface EmployeeStats {
  totalActiveEmployees: number;
  currentWeeklyPayroll: number;
  totalWeeklyCommission: number;
  productivityRanking: ProductivityRankingItem[];
  totalServiceValue: number;
}
