"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Vehicle } from "@/types/vehicle";
import { DataTable } from "@/components/DataTable";
import { VehicleForm } from "./VehicleForm";
import { useVehicle } from "@/hooks/use-vehicles";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { vehicleService } from "@/services/vehicle.service";
import { toast } from "sonner";
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

  const seedMutation = useMutation({
    mutationFn: vehicleService.seed,
    onSuccess: (data) => {
      toast.success("Sincronização com a API FIPE iniciada com sucesso!", {
        description: `${data} novos carros foram adicionados.`,
      });
    },
    onError: (error: any) => {
      toast.error("Falha ao iniciar a sincronização.", {
        description: error.response?.data?.message ?? "Tente novamente mais tarde.",
      });
    },
  });

  return (
    <>
      <DataTable
        columns={columns}
        data={vehicles ?? []}
        isLoading={isLoading}
        filterColumnId="plate"
        filterPlaceholder="Filtrar por placa..."
        createText="Novo Veículo"
        FormComponent={VehicleForm}
        createMutation={createMutation}
        updateMutation={updateMutation}
        deleteMutation={deleteMutation}
      />

      <Button variant="outline" className="text-primary bg-white" onClick={() => seedMutation.mutate()} disabled={seedMutation.isPending}>
        {seedMutation.isPending ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Sincronizando...
          </>
        ) : (
          <>
            <RefreshCw className="mr-4 h-4 w-4" />
            Sincronizar Base de Veículos
          </>
        )}
      </Button>
    </>
  );
}
