import { ServiceOrder } from "./service-order";
import { Vehicle } from "./vehicle";

export type Customer = {
  id: string;
  name: string;
  documentId?: string;
  phone: string;
  email?: string;
  address?: string;
  vehicles?: Vehicle[];
  serviceOrders: ServiceOrder[];
  updatedAt?: string | Date;
};
