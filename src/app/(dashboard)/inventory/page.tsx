"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircleIcon, ArrowUpDown, TriangleAlert, Warehouse } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryMovementService } from "@/services/inventory-movement.service";
import { toast } from "sonner";
import { StockMovementForm } from "./_components/StockMovementForm";
import { InventoryTable } from "./_components/InventoryTable";
import { useParts } from "@/hooks/use-parts";
import { useState } from "react";

export default function InventoryPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { lowStockSummary } = useParts();
  const queryClient = useQueryClient();

  const createMovementMutation = useMutation({
    mutationFn: inventoryMovementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      toast.success("Movimentação de estoque registrada.");
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? "Falha ao registrar movimentação."),
  });

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-primary mb-4 text-2xl font-bold">Gerenciamento de estoque</h1>
        <div className="flex items-center gap-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-card shadow-none h-10">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Registrar entrada/saída
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar movimentação de estoque</DialogTitle>
                <DialogDescription>Ajuste o estoque adicionando ou retirando peças.</DialogDescription>
              </DialogHeader>
              <StockMovementForm
                isPending={createMovementMutation.isPending}
                onSubmit={(values) => createMovementMutation.mutate(values, { onSuccess: () => setIsCreateDialogOpen(false) })}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {lowStockSummary && lowStockSummary.count > 0 && (
        <div className="flex items-center bg-secondary/10 border-1 border-secondary/20 p-4 rounded-md">
          <TriangleAlert className="text-secondary mr-4" />
          <div>
            <p className="text-orange-900 font-medium">Alerta de estoque baixo</p>
            <p className="text-secondary text-sm">
              <span className="font-semibold mr-1">{lowStockSummary.count}</span>peça(s) estão com o estoque abaixo do mínimo.
            </p>
          </div>
        </div>
      )}

      <InventoryTable />
    </div>
  );
}
