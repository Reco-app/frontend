"use client";

import * as React from "react";
import { formatCurrency } from "@/lib/formatters";

import { useExpenses } from "@/hooks/use-expenses";
import { useBills } from "@/hooks/use-bills";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpensesTable } from "./_components/ExpensesTable";
import { BillsTable } from "./_components/BillsTable";
import { BillsCalendar } from "./_components/BillsCalendar";
import { BanknoteArrowDown, CalendarSync, ReceiptText, TriangleAlert } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { cn } from "@/lib/utils";

export default function ExpensesAndBillsPage() {
  const { summary: expenseSummary, isLoading: isLoadingExpenses } = useExpenses();
  const { summary: billSummary, isLoading: isLoadingBills } = useBills();

  return (
    <div className="container mx-auto py-10 space-y-6">
      {billSummary && billSummary.summary.overdueCount > 0 && (
        <div className="flex items-center bg-destructive/10 border-1 border-destructive/20 p-4 rounded-md">
          <TriangleAlert className="text-destructive mr-4" />
          <div>
            <p className="text-destructive font-medium mb-2">Atenção! Boletos Vencidos</p>
            <p className="text-destructive text-sm">
              Você tem <span className="font-semibold">{billSummary.summary.overdueCount} boleto(s) vencido(s)</span>, totalizando
              <span className="ml-1 font-semibold">{formatCurrency(billSummary.summary.overdueValue)}</span>
              <br />
              Regularize o quanto antes para evitar multas e juros.
            </p>
          </div>
        </div>
      )}

      <Tabs defaultValue="expenses">
        <div className="flex justify-between w-[100%] mb-6 items-center">
          <div>
            <h1 className="text-primary text-xl font-bold">Gerenciamento de despesas</h1>
            <p className="text-muted-foreground">Cadastre e monitore despesas</p>
          </div>
          <TabsList className="grid w-[50%] grid-cols-3 p-1 h-fit">
            <TabsTrigger value="expenses" className="h-8 hover:cursor-pointer">
              Despesas
            </TabsTrigger>
            <TabsTrigger value="bills" className="hover:cursor-pointer">
              Boletos
            </TabsTrigger>
            <TabsTrigger value="calendar" className="hover:cursor-pointer">
              Calendário
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="expenses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Total de despesas"
              value={formatCurrency(expenseSummary?.summary.total ?? 0)}
              description="Nos últimos 30 dias"
              icon={<BanknoteArrowDown className="h-4 w-4 text-muted-foreground" />}
              isLoading={isLoadingExpenses}
            />
            <StatCard
              title="Despesas recorrentes"
              value={expenseSummary?.summary.recurringCount ?? 0}
              description="Nos últimos 30 dias"
              secondaryValue={formatCurrency(expenseSummary?.summary.recurringTotal ?? 0)}
              icon={<CalendarSync className="h-4 w-4 text-muted-foreground" />}
              isLoading={isLoadingExpenses}
            />
            <StatCard
              title="Despesas únicas"
              value={expenseSummary?.summary.singleCount ?? 0}
              secondaryValue={formatCurrency(expenseSummary?.summary.singleTotal ?? 0)}
              description="Nos últimos 30 dias"
              icon={<ReceiptText className="h-4 w-4 text-muted-foreground" />}
              isLoading={isLoadingExpenses}
            />
          </div>
          <ExpensesTable />
        </TabsContent>

        <TabsContent value="bills" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Total pendente"
              value={formatCurrency(billSummary?.summary.totalPendingValue ?? 0)}
              description={`${billSummary?.summary.pendingCount} boleto(s) em aberto`}
              icon={<BanknoteArrowDown className="h-4 w-4 text-muted-foreground" />}
              isLoading={isLoadingBills}
            />

            <StatCard
              title="Vencidos"
              value={formatCurrency(billSummary?.summary.overdueValue ?? 0)}
              description={`${billSummary?.summary.overdueCount} boleto(s) vencidos`}
              icon={<CalendarSync className="h-4 w-4 text-muted-foreground" />}
              valueClass={cn((billSummary?.summary.overdueValue ?? 0) > 0 ? "text-destructive" : "text-primary")}
              isLoading={isLoadingBills}
            />

            <StatCard
              title="Pagos"
              value={billSummary?.summary.paidCount ?? 0}
              secondaryValue={formatCurrency(billSummary?.summary.paidTotal ?? 0)}
              description="Nos últimos 30 dias"
              icon={<ReceiptText className="h-4 w-4 text-muted-foreground" />}
              isLoading={isLoadingBills}
            />

            <StatCard
              title="Total de boletos"
              value={billSummary?.summary.totalBills ?? 0}
              description="Cadastrados"
              icon={<ReceiptText className="h-4 w-4 text-muted-foreground" />}
              isLoading={isLoadingBills}
            />
          </div>
          <BillsTable />
        </TabsContent>

        <TabsContent value="calendar">
          <BillsCalendar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
