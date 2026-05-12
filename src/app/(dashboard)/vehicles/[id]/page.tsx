"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarFold, Car, CarFront, Factory, FileText, IdCard, Phone, Plus, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import { formatDate, formatPhone } from "@/lib/formatters";
import { Accordion } from "@/components/ui/accordion";
import { Vehicle } from "@/types/vehicle";
import ServiceOrderItem from "@/components/ServiceOrderItem";
import { DetailsCard, DetailsCardFieldData } from "@/components/DetailsCard";
import { DetailsHeader } from "@/components/DetailsHeader";
import VehicleLoadingPage from "../_components/VehicleLoadingPage";
import ErrorPage from "@/components/ErrorPage";

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
    refetch,
  } = useQuery<Vehicle>({
    queryKey: ["vehicle", vehicleId],
    queryFn: () => fetchVehicleById(vehicleId),
    enabled: !!vehicleId,
  });

  const detailsCardFields: DetailsCardFieldData[] = [
    {
      label: "Nome do funcionário",
      value: vehicle?.owner.name ?? "Não informado",
      icon: <User className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "Telefone do proprietário",
      value: vehicle?.owner.phone ? formatPhone(vehicle.owner.phone) : "Não informado",
      icon: <Phone className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "Placa",
      value: vehicle?.plate || "Não informado",
      icon: <IdCard className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "Marca",
      value: vehicle?.carBrand ?? "Não informado",
      icon: <CarFront className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "Modelo",
      value: vehicle?.carModel ?? "Não informado",
      icon: <Car className="text-muted-foreground max-h-4 min-h-4 max-w-4 min-w-4" />,
    },
    {
      label: "Cadastro",
      value: vehicle?.updatedAt
        ? `Atualizado em ${formatDate(vehicle!.updatedAt!.toString() ?? formatDate(new Date().toString()))}`
        : "Não informado",
      icon: <CalendarFold className="text-muted-foreground h-4 w-4" />,
    },
  ];

  if (isLoading) return <VehicleLoadingPage />;
  if (isError) return <ErrorPage onRetry={refetch} />;

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <DetailsHeader title={`Veículo #${vehicle?.plate}`} description="Detalhes e histórico do veículo" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DetailsCard
            headerTitle="Informações do veículo"
            headerIcon={<Car className="h-5 w-5 text-muted-foreground" />}
            fields={detailsCardFields}
          />
        </div>
        <div className="lg:col-span-2">
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
