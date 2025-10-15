import { Customer } from "./customer";

export type Vehicle = {
  id: string;
  plate: string;
  carBrand: string;
  carModel: string;
  year?: number;
  color?: string;
  ownerId: string;
  owner: Customer;
};

export type Car = {
  brand: string;
  model: string;
};
