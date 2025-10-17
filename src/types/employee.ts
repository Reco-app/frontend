import { Service } from "./service-order";

export enum EmployeeRole {
  ATTENDANT = "Atendente",
  MECHANIC = "Mecânico",
  ADMIN = "Administrador",
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
