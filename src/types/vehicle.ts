import { Customer } from "./customer";
import { ServiceOrder } from "./service-order";

export type Vehicle = {
  id: string;
  plate: string;
  carBrand: string;
  carModel: string;
  year?: number;
  color?: string;
  ownerId: string;
  owner: Customer;
  createdAt: Date;
  updatedAt: Date;
  serviceOrders: ServiceOrder[];
};

export type Car = {
  brand: string;
  model: string;
};
