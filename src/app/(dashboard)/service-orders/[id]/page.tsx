"use client";

import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookUser, CreditCard, Edit, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { PaymentMethod, PaymentStatus, ServiceOrderStatus } from "@/types/service-order";
import { useServiceOrderById } from "@/hooks/use-service-orders";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const statusMap: Record<ServiceOrderStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  AWAITING_APPROVAL: { label: "Aguardando", variant: "outline" },
  APPROVED: { label: "Aprovada", variant: "secondary" },
  IN_PROGRESS: { label: "Em Andamento", variant: "default" },
  FINISHED: { label: "Finalizada", variant: "default" },
  CANCELED: { label: "Cancelada", variant: "destructive" },
};

const paymentStatusMap: Record<PaymentStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  PENDING: { label: "Pendente", variant: "destructive" },
  PARTIAL: { label: "Parcial", variant: "outline" },
  PAID: { label: "Confirmado", variant: "default" },
};

const paymentMethodMap: Record<PaymentMethod, string> = {
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  PIX: "PIX",
  CASH: "Dinheiro",
  BANK_TRANSFER: "Transferência",
};

export default function ServiceOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: order, isLoading, isError } = useServiceOrderById(id);

  const totalPaid = order?.payments.reduce((acc, p) => acc + p.amount, 0) ?? 0;
  const totalAmount = order?.totalAmount ?? 0;
  const subtotal = totalAmount + (order?.discount ?? 0);
  const balance = totalAmount - totalPaid;

  if (isLoading) return <Spinner message="Carregando Ordem de Serviço..." />;
  if (isError) return <div className="text-center text-destructive">Erro ao carregar os dados.</div>;

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-primary mb-4 text-2xl font-bold">Ordem de Serviço #{order?.id.substring(0, 8).toUpperCase()}</h1>
            <p className="text-muted-foreground mt-2">
              Cliente: <span className="font-semibold">{order?.customer.name}</span>
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/service-orders/${id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary flex items-center">
            <BookUser className="mr-2" />
            Detalhes da OS
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between pr-16">
          <div>
            <div>
              <p className="text-sm font-semibold mb-1 text-primary">Veículo</p>
              <p className="text-sm">
                {order?.vehicle.carBrand} {order?.vehicle.carModel} | {order?.vehicle.plate}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold mt-4 mb-1 text-primary">Data de Entrada</p>
              <p className="text-sm">{formatDate(order!.entryDate)}</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-sm font-semibold text-primary mb-2">Status</p>
              <Badge variant={statusMap[order!.status].variant}>{statusMap[order!.status].label}</Badge>
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-2">Pagamento</p>
              <Badge variant={paymentStatusMap[order!.paymentStatus].variant}>{paymentStatusMap[order!.paymentStatus].label}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Wrench className="mr-2" />
            Serviços e Peças
          </CardTitle>
        </CardHeader>
        <CardContent>
          {order?.services && order.services.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {order.services.map((service) => {
                const totalServiceCost =
                  service.laborCost +
                  service.partsUsed.reduce((acc, partUsage) => {
                    return acc + partUsage.part.salePrice * partUsage.quantityUsed;
                  }, 0);

                return (
                  <AccordionItem value={service.id} key={service.id}>
                    <AccordionTrigger>
                      <div className="flex justify-between w-full">
                        <span className="font-semibold text-primary text-sm text-left">{service.name.toUpperCase()}</span>
                        <span className="font-mono text-sm text-primary">{formatCurrency(totalServiceCost)}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-4 pt-2">
                      <p className="text-sm text-muted-foreground mt-1">
                        Mão de obra: {formatCurrency(service.laborCost)} | Mecânico: {service.employee.name}
                      </p>
                      {service.partsUsed.length > 0 ? (
                        <>
                          <p className="text-sm font-semibold mt-3 mb-1 text-primary">Peças utilizadas:</p>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {service.partsUsed.map((partUsage) => (
                              <li key={partUsage.part.id} className="text-primary">
                                {partUsage.quantityUsed}x {partUsage.part.name} ({formatCurrency(partUsage.part.salePrice)} cada)
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground mt-2">Nenhuma peça utilizada neste serviço.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum serviço registrado nesta OS.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <CreditCard className="mr-2" />
            Resumo Financeiro
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {order?.payments && order.payments.length > 0 ? (
              <div className="space-y-3">
                {order.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between items-center text-sm p-3 border rounded-lg bg-muted/30">
                    <div>
                      <p className="font-medium text-primary">{paymentMethodMap[payment.method]}</p>
                      <p className="text-muted-foreground text-xs">Realizado em: {formatDate(payment.date)}</p>
                    </div>
                    <p className="font-semibold text-primary">{formatCurrency(payment.amount)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center min-h-[100%] items-center flex justify-center">
                Nenhum pagamento registrado.
              </p>
            )}
          </div>

          <div className="space-y-2 text-right bg-muted/30 p-4 border rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-primary">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Desconto</span>
              <span className="text-primary">- {formatCurrency(order!.discount)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-primary">Total a Pagar</span>
              <span className="text-primary">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total Pago</span>
              <span className="text-primary">{formatCurrency(totalPaid)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center text-md font-bold">
              <span className={cn(balance > 0 ? "text-destructive" : "text-green-600")}>Saldo</span>
              <span className={cn(balance > 0 ? "text-destructive" : "text-green-600")}>{formatCurrency(balance)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
