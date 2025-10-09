"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Part } from "@/types/inventory";
import { useParts } from "@/hooks/use-parts";
import { DataTable } from "@/components/DataTable";
import { PartForm } from "./PartForm";

const columns: ColumnDef<Part>[] = [
  {
    accessorKey: "code",
    header: "Código",
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "manufacturer",
    header: "Fabricante",
  },
  {
    accessorKey: "purchasePrice",
    header: "Preço Compra",
    cell: ({ row }) => formatCurrency(row.getValue("purchasePrice")),
  },
  {
    accessorKey: "salePrice",
    header: "Preço Venda",
    cell: ({ row }) => formatCurrency(row.getValue("salePrice")),
  },
  {
    accessorKey: "quantity",
    header: "Estoque",
    cell: ({ row }) => {
      const part = row.original;
      return (
        <div className="flex items-center gap-2">
          <span>{part.quantity}</span>
          {part.isLowStock && (
            <Badge variant="destructive" className="bg-secondary">
              Baixo
            </Badge>
          )}
        </div>
      );
    },
  },
];

export function InventoryTable() {
  const { parts, isLoading, createMutation, updateMutation, deleteMutation } = useParts();

  return (
    <DataTable
      columns={columns}
      data={parts ?? []}
      isLoading={isLoading}
      filterColumnId="name"
      filterPlaceholder="Filtrar por nome da peça..."
      createText="Nova Peça"
      FormComponent={PartForm}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
}
