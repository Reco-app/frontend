"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "@/types/customer";
import { CustomerForm } from "./CustomerForm";
import { DataTable } from "@/components/DataTable";
import { useCustomer } from "@/hooks/use-customers";

const columns: ColumnDef<Customer>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "documentId",
    header: "CPF/CNPJ",
    enableSorting: false,
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    enableSorting: false,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: false,
  },
];

export function CustomersTable() {
  const { customers, isLoading, createMutation, updateMutation, deleteMutation } = useCustomer();

  return (
    <DataTable
      columns={columns}
      data={customers ?? []}
      isLoading={isLoading}
      viewDetailsRoute="/customers"
      filterColumnId="name"
      filterPlaceholder="Filtrar por nome..."
      createText="Novo Cliente"
      FormComponent={CustomerForm}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
}
