import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { capitalize, formatCurrency, formatDate } from "@/lib/formatters";
import { Service, ServiceOrder } from "@/types/service-order";
import { Banknote, Calendar, Car, Dot, Wrench } from "lucide-react";
import React, { useMemo } from "react";

interface ServiceItemProps {
  service: Service;
}

export default function ServiceItem({ service }: ServiceItemProps) {
  const totalCost = useMemo(() => {
    const laborCost = service.laborCost || 0;

    const partsCost =
      service.partsUsed?.reduce((total, item) => {
        const partTotal = (item.part.salePrice || 0) * (item.quantityUsed || 0);
        return total + partTotal;
      }, 0) ?? 0;

    return laborCost + partsCost;
  }, [service]);

  return (
    <AccordionItem value={service.id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex items-center gap-3">
            <div className="text-left font-medium">
              <span className="text-primary/70 border-r-3 border-primary/20 pr-2 text-xs">OS #{service.id.split("-")[0]}</span>
              <span className="text-primary pl-2">{capitalize(service.name)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-secondary">{formatCurrency(totalCost)}</span>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-primary">
            <div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">Realizado em:</span> {formatDate(service.createdAt.toString())}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Banknote className="h-3 w-3" />
                  <span className="font-medium">Mão de obra:</span> {formatCurrency(service.laborCost)}
                </p>
                <div className="flex items-baseline gap-2 text-muted-foreground">
                  <Car className="min-h-3 h-3 min-w-3 w-3" />
                  <div className="">
                    <span className="font-medium mr-2">Veículo:</span>
                    <span className="wrap-normal">{`${service.serviceOrder.vehicle.carBrand} ${service.serviceOrder.vehicle.carModel}`}</span>
                  </div>
                </div>
              </div>
            </div>

            {service.partsUsed.length && (
              <div>
                <div className="flex items-center text-muted-foreground">
                  <Wrench className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Peças utilizadas</span>
                </div>
                <ul className="pl-2 gap-2">
                  {service.partsUsed?.map((item, index) => (
                    <li key={index} className="flex text-muted-foreground">
                      <span className="flex items-center">
                        <Dot /> {`${capitalize(item.part.name)} - ${item.quantityUsed} unid.`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
