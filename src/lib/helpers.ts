import { PaymentStatus, ServiceOrderStatus } from "@/types/service-order";

export const renderCell = (info: any) => {
  const value = info.getValue();
  return value ?? "Não informado.";
};

export const statusMap: Record<ServiceOrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  AWAITING_APPROVAL: { label: "Aguardando", variant: "outline" },
  APPROVED: { label: "Aprovada", variant: "secondary" },
  IN_PROGRESS: { label: "Em Andamento", variant: "outline" },
  FINISHED: { label: "Finalizada", variant: "outline" },
  CANCELED: { label: "Cancelada", variant: "destructive" },
};

export const paymentStatusMap: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pendente", variant: "outline" },
  PARTIAL: { label: "Parcial", variant: "outline" },
  PAID: { label: "Pago", variant: "outline" },
};
