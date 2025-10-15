"use client";

import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ServiceOrder, ServiceOrderStatus, PaymentStatus } from "@/types/service-order";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useServiceOrders } from "@/hooks/use-service-orders";
import { DataTable } from "@/components/DataTable";

const statusMap: Record<ServiceOrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  AWAITING_APPROVAL: { label: "Aguardando", variant: "outline" },
  APPROVED: { label: "Aprovada", variant: "secondary" },
  IN_PROGRESS: { label: "Em Andamento", variant: "outline" },
  FINISHED: { label: "Finalizada", variant: "secondary" },
  CANCELED: { label: "Cancelada", variant: "destructive" },
};

const paymentStatusMap: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pendente", variant: "destructive" },
  PARTIAL: { label: "Parcial", variant: "outline" },
  PAID: { label: "Pago", variant: "secondary" },
};

const EmptyFormComponent = () => null;

export function ServiceOrdersTable() {
  const router = useRouter();
  const { data: serviceOrders, isLoading } = useServiceOrders();

  const columns: ColumnDef<ServiceOrder>[] = [
    {
      accessorKey: "id",
      header: "OS Nº",
      enableSorting: false,
      cell: ({ row }) => <span className="font-mono uppercase">{row.original.id.substring(0, 8)}</span>,
    },
    {
      accessorKey: "customer.name",
      header: "Cliente",
    },
    {
      accessorKey: "vehicle.plate",
      header: "Placa",
      cell: ({ row }) => <Badge variant="outline">{row.original.vehicle.plate}</Badge>,
    },
    {
      accessorKey: "entryDate",
      header: "Data de Entrada",
      cell: ({ row }) => formatDate(row.getValue("entryDate")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as ServiceOrderStatus;
        const { label, variant } = statusMap[status] || { label: status, variant: "default" };
        return (
          <Badge variant={variant} className="capitalize">
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Pagamento",
      cell: ({ row }) => {
        const status = row.getValue("paymentStatus") as PaymentStatus;
        const { label, variant } = paymentStatusMap[status] || { label: status, variant: "default" };
        return (
          <Badge variant={variant} className="capitalize">
            {label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Valor Total",
      cell: ({ row }) => formatCurrency(row.getValue("totalAmount") ?? 0),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={serviceOrders ?? []}
      isLoading={isLoading}
      filterColumnId="id"
      filterPlaceholder="Filtrar por nome do cliente..."
      createText="Nova Ordem de Serviço"
      onCreate={() => router.push("/service-orders/new")}
      onEdit={(order) => router.push(`/service-orders/${order.id}/edit`)}
      viewDetailsRoute="/service-orders"
      FormComponent={EmptyFormComponent}
      createMutation={{ mutate: () => {}, isPending: false }}
      updateMutation={{ mutate: () => {}, isPending: false }}
    />
  );
}
