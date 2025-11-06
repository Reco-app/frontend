"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Vehicle } from "@/types/vehicle";
import { DataTable } from "@/components/DataTable";
import { VehicleForm } from "./VehicleForm";
import { useVehicle } from "@/hooks/use-vehicles";
import { renderCell } from "@/lib/helpers";

const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "plate",
    header: "Placa",
    enableSorting: false,
  },
  {
    accessorKey: "carBrand",
    header: "Marca",
    enableSorting: false,
  },
  {
    accessorKey: "carModel",
    header: "Modelo",
  },
  {
    accessorKey: "year",
    header: "Ano",
    enableSorting: false,
    cell: renderCell,
  },
  {
    accessorKey: "color",
    header: "Cor",
    enableSorting: false,
    cell: renderCell,
  },
  {
    accessorKey: "owner.name",
    header: "Proprietário",
    enableSorting: true,
  },
];

export function VehiclesTable() {
  const { vehicles, isLoading, createMutation, updateMutation, deleteMutation } = useVehicle();

  return (
    <DataTable
      columns={columns}
      data={vehicles ?? []}
      isLoading={isLoading}
      filterColumnId="plate"
      filterPlaceholder="Filtrar por placa..."
      createText="Novo Veículo"
      FormComponent={VehicleForm}
      viewDetailsRoute="/vehicles/"
      createMutation={createMutation}
      updateMutation={updateMutation}
      deleteMutation={deleteMutation}
    />
  );
}
