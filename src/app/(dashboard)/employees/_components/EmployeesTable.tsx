"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Employee, EmployeeRole } from "@/types/employee";
import { EmployeeForm } from "./EmployeeForm";
import { formatCurrency } from "@/lib/formatters";
import { DataTable } from "@/components/DataTable";
import { useEmployee } from "@/hooks/use-employees";

const columns: ColumnDef<Employee>[] = [
  { accessorKey: "name", header: "Nome Completo" },
  { accessorKey: "documentId", header: "CPF", enableSorting: false },
  { accessorKey: "phone", header: "Telefone", enableSorting: false },
  {
    accessorKey: "role",
    header: "Cargo",
    cell: ({ row }) => {
      const roleKey = row.getValue("role") as keyof typeof EmployeeRole;
      return EmployeeRole[roleKey];
    },
  },
  {
    accessorKey: "salary",
    header: "Salário",
    cell: ({ row }) => formatCurrency(row.getValue("salary")),
  },
];

export function EmployeesTable() {
  const { employees, isLoading, createMutation, updateMutation, deleteMutation } = useEmployee();

  return (
    <DataTable
      columns={columns}
      data={employees ?? []}
      isLoading={isLoading}
      filterColumnId="name"
      filterPlaceholder="Filtrar por nome..."
      createText="Novo Funcionário"
      FormComponent={EmployeeForm}
      viewDetailsRoute="/employees"
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
}
