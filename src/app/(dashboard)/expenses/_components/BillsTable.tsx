"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Bill, BillStatus } from "@/types/bill";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import TableActions from "@/components/TableActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CheckCircle } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { useBills } from "@/hooks/use-bills";
import { BillForm } from "./BillsForm";
import Spinner from "@/components/Spinner";

const calculatedStatusMap: Record<BillStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pendente", variant: "outline" },
  PAID: { label: "Pago", variant: "secondary" },
  OVERDUE: { label: "Vencido", variant: "destructive" },
};

export function BillsTable() {
  const [isPayConfirmOpen, setIsPayConfirmOpen] = React.useState(false);
  const [billToPay, setBillToPay] = React.useState<Bill | null>(null);

  const { bills, isLoading, createMutation, updateMutation, deleteMutation, markAsPaidMutation } = useBills();

  const handleConfirmPayment = () => {
    if (billToPay) {
      markAsPaidMutation.mutate(
        { id: billToPay.id, data: {} },
        {
          onSuccess: () => {
            setIsPayConfirmOpen(false);
            setBillToPay(null);
          },
          onError: () => {
            setIsPayConfirmOpen(false);
            setBillToPay(null);
          },
        }
      );
    }
  };

  const columns: ColumnDef<Bill>[] = [
    {
      accessorKey: "description",
      header: "Descrição",
    },
    {
      accessorKey: "supplier",
      header: "Fornecedor",
      cell: ({ row }) => row.getValue("supplier") || "-",
    },
    {
      accessorKey: "value",
      header: "Valor",
      cell: ({ row }) => formatCurrency(row.getValue("value")),
    },
    {
      accessorKey: "dueDate",
      header: "Vencimento",
      cell: ({ row }) => formatDate(row.getValue("dueDate")),
    },
    {
      accessorKey: "calculatedStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("calculatedStatus") as BillStatus;
        const { label, variant } = calculatedStatusMap[status] || { label: status, variant: "default" };
        return (
          <Badge variant={variant} className="capitalize">
            {label}
          </Badge>
        );
      },
    },
    {
      id: "customActions",
      cell: ({ row }) => {
        const bill = row.original;
        const isPaid = bill.status === BillStatus.PAID;

        return (
          <TableActions
            onEdit={() => {
              console.log("Editar:", bill.id);
            }}
            onDelete={() => {
              console.log("Excluir:", bill.id);
            }}
          >
            {!isPaid && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-green-600 focus:bg-green-100 focus:text-green-700"
                  onClick={() => {
                    setBillToPay(bill);
                    setIsPayConfirmOpen(true);
                  }}
                  disabled={markAsPaidMutation.isPending}
                >
                  <CheckCircle className="h-4 w-4" />
                  Marcar como Pago
                </DropdownMenuItem>
              </>
            )}
          </TableActions>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        columns={columns.filter((col) => col.id !== "actions")}
        data={bills ?? []}
        isLoading={isLoading}
        filterColumnId="description"
        filterPlaceholder="Filtrar por descrição..."
        createText="Novo Boleto"
        FormComponent={BillForm}
        actions={false}
        createMutation={createMutation}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
      />

      <AlertDialog open={isPayConfirmOpen} onOpenChange={setIsPayConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Pagamento?</AlertDialogTitle>
            <AlertDialogDescription>
              Você confirma que o boleto "{billToPay?.description}" no valor de {formatCurrency(billToPay?.value ?? 0)} foi pago? Esta ação
              não pode ser desfeita facilmente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBillToPay(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmPayment} disabled={markAsPaidMutation.isPending}>
              {markAsPaidMutation.isPending ? <Spinner /> : "Sim, confirmar pagamento"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
