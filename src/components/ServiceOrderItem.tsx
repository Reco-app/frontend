"use client";

import { AlertCircle, Calendar, CheckCircle, Clock, Dot, XCircle } from "lucide-react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { capitalize, formatCurrency, formatDate } from "@/lib/formatters";
import { Button } from "./ui/button";
import { ServiceOrder, ServiceOrderStatus } from "@/types/service-order";
import { useRouter } from "next/navigation";

const getStatusIcon = (status: ServiceOrder["status"]) => {
  switch (status) {
    case ServiceOrderStatus.FINISHED:
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case ServiceOrderStatus.IN_PROGRESS:
      return <Clock className="h-4 w-4 text-blue-600" />;
    case ServiceOrderStatus.AWAITING_APPROVAL:
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case ServiceOrderStatus.CANCELED:
      return <XCircle className="h-4 w-4 text-red-600" />;
  }
};

interface ServiceOrderItemProps {
  order: ServiceOrder;
}

export default function ServiceOrderItem({ order }: ServiceOrderItemProps) {
  const router = useRouter();
  console.log(order);
  return (
    <AccordionItem value={order.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-3">
            {getStatusIcon(order.status)}
            <div className="text-left font-medium">
              <span className="text-primary/70 border-r-3 border-primary/20 pr-2 text-xs">OS #{order.id.split("-")[0]}</span>
              <span className="text-primary pl-2">{order.vehicle && `${order.vehicle?.carBrand} - ${order.vehicle?.carModel}`}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-secondary">{formatCurrency(order.totalAmount ?? 0)}</span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary">
            <div>
              <h5 className="font-medium mb-2 text-muted-foreground">Datas</h5>
              <div className="space-y-2 text-sm pl-2">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">Entrada:</span> {formatDate(order.entryDate)}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">{order.status === ServiceOrderStatus.FINISHED ? "Saída:" : "Saída prevista:"}</span>
                  <span>{(order.predictedExitDate && formatDate(order.predictedExitDate)) || "Não informada."}</span>
                </p>
              </div>
            </div>

            {order.services.length > 0 && (
              <div className="text-muted-foreground">
                <h5 className="font-medium mb-2">Serviços</h5>
                <ul className="space-y-1 text-sm">
                  {order.services?.map((service, index) => (
                    <li key={index} className="flex items-center gap-2 text-muted-foreground">
                      <span className="flex items-center">
                        <Dot /> {capitalize(service.name)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {order.problemDescription && (
            <div>
              <h5 className="font-medium mb-2 text-muted-foreground">Observações</h5>
              <p className="text-sm text-muted-foreground bg-muted/50 border px-4 py-2 rounded-md wrap-break-word">
                {capitalize(order.problemDescription)}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => router.push(`/service-orders/${order.id}/edit`)}>
              Editar OS
            </Button>
            <Button size="sm" onClick={() => router.push(`/service-orders/${order.id}/`)}>
              Ver Detalhes
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
