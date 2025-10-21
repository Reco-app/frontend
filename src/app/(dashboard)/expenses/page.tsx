"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/formatters";

import { useExpenses } from "@/hooks/use-expenses";
import { useBills } from "@/hooks/use-bills";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpensesTable } from "./_components/ExpensesTable";
import { BillsTable } from "./_components/BillsTable";
import { BillsCalendar } from "./_components/BillsCalendar";
import { TriangleAlert } from "lucide-react";

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
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="bills">Boletos</TabsTrigger>
          <TabsTrigger value="calendar">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="text-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(expenseSummary?.summary.total ?? 0)}</div>
                <p className="text-sm text-muted-foreground">Nos últimos 30 dias</p>
              </CardContent>
            </Card>
            <Card className="text-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Despesas Recorrentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end">
                  <span className="text-2xl font-bold">{expenseSummary?.summary.recurringCount ?? 0}</span>
                  <span className="ml-4 text-sm text-muted-foreground font-medium">
                    {formatCurrency(expenseSummary?.summary.recurringTotal ?? 0)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Despesas mensais</p>
              </CardContent>
            </Card>
            <Card className="text-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Despesas Únicas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end">
                  <span className="text-2xl font-bold">{expenseSummary?.summary.singleCount ?? 0}</span>
                  <span className="ml-4 text-sm font-medium text-muted-foreground">
                    {formatCurrency(expenseSummary?.summary.singleTotal ?? 0)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Nos últimos 30 dias</p>
              </CardContent>
            </Card>
          </div>
          <ExpensesTable />
        </TabsContent>

        <TabsContent value="bills" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="text-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Pendente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(billSummary?.summary.totalPendingValue ?? 0)}</div>
                <p className="text-sm text-muted-foreground">{billSummary?.summary.pendingCount ?? 0} boleto(s) em aberto</p>
              </CardContent>
            </Card>
            <Card className="text-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-destructive">Vencidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{formatCurrency(billSummary?.summary.overdueValue ?? 0)}</div>
                <p className="text-sm text-muted-foreground">{billSummary?.summary.overdueCount ?? 0} boleto(s) vencidos</p>
              </CardContent>
            </Card>
            <Card className="text-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pagos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end">
                  <span className="text-2xl font-bold">{billSummary?.summary.paidCount ?? 0}</span>
                  <span className="ml-4 text-sm font-medium text-muted-foreground">
                    {formatCurrency(billSummary?.summary.paidTotal ?? 0)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Nos últimos 30 dias</p>
              </CardContent>
            </Card>
            <Card className="text-primary">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total de Boletos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end">
                  <span className="text-2xl font-bold">{billSummary?.summary.totalBills ?? 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Cadastrados</p>
              </CardContent>
            </Card>
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
