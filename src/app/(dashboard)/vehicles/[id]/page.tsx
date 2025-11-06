"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarFold, Car, CarFront, Factory, FileText, IdCard, Phone, Plus, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import { formatDate } from "@/lib/formatters";
import { Accordion } from "@/components/ui/accordion";
import { Vehicle } from "@/types/vehicle";
import ServiceOrderItem from "@/components/ServiceOrderItem";

const fetchVehicleById = async (id: string): Promise<Vehicle> => {
  const { data } = await api.get(`/vehicles/${id}`);
  return data;
};

export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = params.id as string;

  const router = useRouter();

  const {
    data: vehicle,
    isLoading,
    isError,
  } = useQuery<Vehicle>({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => fetchVehicleById(vehicleId),
    enabled: !!vehicleId,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <div>Erro ao buscar dados do cliente.</div>;

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-8 w-8" />
        </Button>
        <div>
          <h1 className="text-primary mb-1 text-2xl font-bold">Veículo #{vehicle?.plate}</h1>
          <p className="text-muted-foreground">Detalhes e histórico do veículo</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CarFront className="h-5 w-5" />
                Informações do veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="text-muted-foreground max-h-4 min-h-4 max-w-4 min-w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Proprietário</p>
                  <p className="text-muted-foreground text-sm">{vehicle?.owner.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-muted-foreground max-h-4 min-h-4 max-w-4 min-w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Telefone do proprietário</p>
                  <p className="text-muted-foreground text-sm">{vehicle?.owner.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IdCard className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Placa</p>
                  <p className="text-muted-foreground text-sm">{vehicle?.plate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Factory className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Marca</p>
                  <p className="text-muted-foreground text-sm">{vehicle?.carBrand}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Modelo</p>
                  <p className="text-muted-foreground text-sm">{vehicle?.carModel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarFold className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Cadastro</p>
                  <p className="text-muted-foreground text-sm">{`Atualizado em: ${formatDate(vehicle!.updatedAt.toString())}`}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader className="flex items-center justify-between text-primary">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Ordens de Serviço ({vehicle?.serviceOrders.length})
              </CardTitle>
              <Button size="sm" variant="secondary" className="text-white" onClick={() => router.push("/service-orders/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar OS
              </Button>
            </CardHeader>
            <CardContent>
              {vehicle?.serviceOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhuma ordem de serviço encontrada para este cliente.</p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {vehicle?.serviceOrders.map((order) => (
                    <ServiceOrderItem key={order.id} order={order} />
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
