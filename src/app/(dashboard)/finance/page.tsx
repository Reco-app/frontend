"use client";

import { useRouter } from "next/navigation";
import { TrendingUp, TrendingDown, FileText, BanknoteArrowUp, BanknoteArrowDown, HandCoins } from "lucide-react";

import { useFinanceDashboard } from "@/hooks/use-finance-dashboard";
import { StatCard } from "@/components/StatCard";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { PaymentStatus } from "@/types/service-order";
import { ReceivableItem, RecentExpenseItem } from "@/types/finance";
import { cn } from "@/lib/utils";
import { FinanceTable, FinanceTableColumn } from "./_components/FinanceTable";

const paymentStatusMap: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pendente", variant: "destructive" },
  PARTIAL: { label: "Parcial", variant: "outline" },
  PAID: { label: "Confirmado", variant: "default" },
};

export default function FinancePage() {
  const { dashboardData, isLoading, isError } = useFinanceDashboard();
  const router = useRouter();

  const receivablesColumns: FinanceTableColumn<ReceivableItem>[] = [
    { header: "Cliente", accessorKey: "customerName" },
    { header: "Veículo", accessorKey: "vehiclePlate" },
    { header: "Valor", cell: (item) => formatCurrency(item.value), className: "text-right" },
    { header: "Data Conclusão", cell: (item) => formatDate(item.conclusionDate) },
    {
      header: "Status",
      cell: (item) => (
        <Badge variant={paymentStatusMap[item.status]?.variant || "outline"}>{paymentStatusMap[item.status]?.label || item.status}</Badge>
      ),
    },
  ];

  const expensesColumns: FinanceTableColumn<RecentExpenseItem>[] = [
    { header: "Nome", accessorKey: "name" },
    { header: "Categoria", accessorKey: "category" },
    { header: "Valor", cell: (item) => formatCurrency(item.value), className: "text-right" },
    { header: "Data", cell: (item) => formatDate(item.date) },
    {
      header: "Tipo",
      cell: (item) => <Badge variant={item.isRecurring ? "secondary" : "outline"}>{item.isRecurring ? "Recorrente" : "Única"}</Badge>,
    },
  ];

  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <div className="container mx-auto py-10 text-center text-destructive">
        Erro ao carregar o dashboard financeiro. Tente novamente mais tarde.
      </div>
    );

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Controle Financeiro</h1>
        <Button variant="default">
          <FileText className="mr-2 h-4 w-4" /> Exportar Relatório
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Receitas"
          value={formatCurrency(dashboardData?.totalRevenueReceived ?? 0)}
          description="Pagamentos recebidos"
          icon={<BanknoteArrowUp className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Despesas"
          value={formatCurrency(dashboardData?.totalExpenses ?? 0)}
          description="Total de gastos"
          icon={<BanknoteArrowDown className="h-4 w-4 text-muted-foreground" />}
          isLoading={isLoading}
        />
        <StatCard
          title="Lucro líquido"
          value={formatCurrency(dashboardData?.netProfit ?? 0)}
          description="Receitas - Despesas"
          icon={
            (dashboardData?.netProfit ?? 0) >= 0 ? (
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            )
          }
          valueClass={cn((dashboardData?.netProfit ?? 0) < 0 ? "text-destructive" : "text-green-600")}
          isLoading={isLoading}
        />
        <StatCard
          title="A receber"
          value={formatCurrency(dashboardData?.totalReceivablesAmount ?? 0)}
          description={`${dashboardData?.receivablesCount ?? 0} OS pendente(s)`}
          icon={<HandCoins className="h-4 w-4 text-muted-foreground" />}
          valueClass="text-amber-600"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FinanceTable
          title="Contas a Receber"
          description="Ordens de serviço concluídas com pagamento pendente"
          columns={receivablesColumns}
          data={dashboardData?.recentReceivables ?? []}
          isLoading={isLoading}
          onRowClick={(item) => router.push(`/service-orders/${item.id}`)}
          noDataMessage="Nenhuma conta a receber encontrada."
          itemsPerPage={5}
        />

        <FinanceTable
          title="Despesas Recentes"
          description="Últimas despesas registradas"
          columns={expensesColumns}
          data={dashboardData?.recentExpenses ?? []}
          isLoading={isLoading}
          noDataMessage="Nenhuma despesa recente encontrada."
          itemsPerPage={5}
        />
      </div>
    </div>
  );
}
