"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Employee } from "@/types/employee";
import { EmployeeForm } from "./EmployeeForm";
import { formatCurrency } from "@/lib/formatters";
import { DataTable } from "@/components/DataTable";
import { useEmployee } from "@/hooks/use-employees";

const columns: ColumnDef<Employee>[] = [
  { accessorKey: "name", header: "Nome Completo" },
  { accessorKey: "documentId", header: "CPF", enableSorting: false },
  { accessorKey: "phone", header: "Telefone", enableSorting: false },
  { accessorKey: "role", header: "Cargo" },
  {
    accessorKey: "salary",
    header: "Salário",
    cell: ({ row }) => formatCurrency(row.getValue("salary")),
  },
];

export function EmployeesTable() {
  const { employees, isError, isLoading, createMutation, updateMutation, deleteMutation } = useEmployee();

  if (isError) {
    return <span>Não foi possível buscar as informações de funcionários.</span>;
  }

  return (
    <DataTable
      columns={columns}
      data={employees ?? []}
      isLoading={isLoading}
      filterColumnId="name"
      filterPlaceholder="Filtrar por nome..."
      createText="Novo Funcionário"
      FormComponent={EmployeeForm}
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
}
