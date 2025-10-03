export type Customer = {
  id: string;
  name: string;
  documentId?: string;
  phone: string;
  email?: string;
  address?: string;
  vehicles?: Vehicle[];
  updatedAt?: string | Date;
};
