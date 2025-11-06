"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowUpDown, DollarSign, ListChecks, Package, TriangleAlert, Warehouse } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryMovementService } from "@/services/inventory-movement.service";
import { toast } from "sonner";
import { StockMovementForm } from "./_components/StockMovementForm";
import { InventoryTable } from "./_components/InventoryTable";
import { useParts } from "@/hooks/use-parts";
import { useState } from "react";
import { StatCard } from "@/components/StatCard";
import { MostUsedParts } from "./_components/MostUsedParts";

export default function InventoryPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { stockSummary } = useParts();
  const queryClient = useQueryClient();

  const createMovementMutation = useMutation({
    mutationFn: inventoryMovementService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts", "summary"] });
      toast.success("Movimentação de estoque registrada.");
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? "Falha ao registrar movimentação."),
  });

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex justify-between w-[100%] items-center">
          <h1 className="text-primary mb-4 text-xl font-bold">Gerenciamento de estoque</h1>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-card shadow-none h-10">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Registrar entrada/saída
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-md text-primary">Registrar movimentação de estoque</DialogTitle>
                <DialogDescription className="-mt-1">Ajuste o estoque adicionando ou retirando peças.</DialogDescription>
              </DialogHeader>
              <StockMovementForm
                isPending={createMovementMutation.isPending}
                onSubmit={(values) => createMovementMutation.mutate(values, { onSuccess: () => setIsCreateDialogOpen(false) })}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Peças cadastradas"
          value={stockSummary?.totalItems ?? 0}
          icon={<Package className="h-5 w-5 text-muted-foreground" />}
          description="Número de peças únicas cadastradas"
        />
        <StatCard
          title="Valor em estoque"
          value={stockSummary?.totalStockValue ?? 0}
          isMonetary
          icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
          description="Baseado no preço de compra"
        />
        <StatCard
          title="Estoque crítico"
          value={stockSummary?.lowStockItemsCount ?? 0}
          icon={<ListChecks className="h-5 w-5 text-muted-foreground" />}
          description="Itens abaixo do estoque mínimo"
        />
        <StatCard
          title="Valor (Estoque crítico)"
          value={stockSummary?.lowStockItemsValue ?? 0}
          isMonetary
          icon={<Warehouse className="h-5 w-5 text-muted-foreground" />}
          description="Valor total dos itens em falta"
        />
      </div>

      <div className="grid lg:grid-cols-5 sm:grid-cols-1 gap-4">
        <div className="lg:col-span-3">
          <InventoryTable />
        </div>
        <div className="lg:col-span-2 mt-4">
          <MostUsedParts />
        </div>
      </div>
    </div>
  );
}
