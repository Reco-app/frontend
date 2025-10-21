"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Expense } from "@/types/expense";
import { DataTable } from "@/components/DataTable";
import { useExpenses } from "@/hooks/use-expenses";
import { ExpenseForm } from "./ExpenseForm";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";

const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "value",
    header: "Valor",
    cell: ({ row }) => formatCurrency(row.getValue("value")),
  },
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => formatDate(row.getValue("date")),
  },
  {
    accessorKey: "isRecurring",
    header: "Tipo",
    cell: ({ row }) => {
      const isRecurring = row.getValue("isRecurring");
      return <Badge variant={isRecurring ? "secondary" : "outline"}>{isRecurring ? "Recorrente (Mensal)" : "Única"}</Badge>;
    },
  },
  {
    accessorKey: "observations",
    header: "Observações",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground truncate max-w-[200px] inline-block">{row.getValue("observations") || "-"}</span>
    ),
  },
];

export function ExpensesTable() {
  const { expenses, isLoading, createMutation, updateMutation, deleteMutation } = useExpenses();

  return (
    <DataTable
      columns={columns}
      data={expenses ?? []}
      isLoading={isLoading}
      filterColumnId="category"
      filterPlaceholder="Filtrar por categoria..."
      createText="Nova Despesa"
      FormComponent={ExpenseForm}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
}
