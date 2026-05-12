"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import { CalendarFold, Car, Contact, FileText, Mail, MapPin, Phone, Plus, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VehicleForm } from "@/components/VehicleForm";
import { AxiosError } from "axios";
import { formatDate, formatDocument, formatPhone } from "@/lib/formatters";
import { Accordion } from "@/components/ui/accordion";
import ServiceOrderItem from "@/components/ServiceOrderItem";
import ErrorPage from "@/components/ErrorPage";
import CustomerLoadingPage from "../_components/CustomerLoadingPage";
import { CustomerVehicleCard } from "../_components/CustomerVehicleCard";
import { DetailsCard, DetailsCardFieldData } from "@/components/DetailsCard";
import { DetailsHeader } from "@/components/DetailsHeader";

const fetchCustomerById = async (id: string): Promise<Customer> => {
  const { data } = await api.get(`/customers/${id}`);
  return data;
};

const createVehicle = (vehicleData: any) => api.post("/vehicles", vehicleData);

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params.id as string;

  const router = useRouter();

  const queryClient = useQueryClient();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: customer,
    isLoading,
    isError,
    refetch,
  } = useQuery<Customer>({
    queryKey: ["customer", customerId],
    queryFn: () => fetchCustomerById(customerId),
    enabled: !!customerId,
  });

  const createVehicleMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      toast.success("Veículo adicionado com sucesso.");
      setIsDialogOpen(false);
    },
    onError: (err: AxiosError) => {
      const error: any = err.response?.data;
      toast.error(error.message || "Não foi possível adicionar o veículo.");
    },
  });

  const handleAddVehicle = (values: any) => {
    createVehicleMutation.mutate({ ...values, ownerId: customerId });
  };

  const detailsCardFields: DetailsCardFieldData[] = [
    {
      label: "Nome do cliente",
      value: customer?.name ?? "Não informado",
      icon: <Contact className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "N° do documento",
      value: customer?.documentId ? formatDocument(customer.documentId) : "Não informado",
      icon: <FileText className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "N° do telefone",
      value: formatPhone(customer?.phone),
      icon: <Phone className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "Email",
      value: customer?.email || "Não informado",
      icon: <Mail className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "Endereço",
      value: customer?.address || "Não informado",
      icon: <MapPin className="text-muted-foreground max-h-4 min-h-4 max-w-4 min-w-4" />,
    },
    {
      label: "Cadastro",
      value: customer?.updatedAt
        ? `Atualizado em ${formatDate(customer!.updatedAt!.toString() ?? formatDate(new Date().toString()))}`
        : "Não informado",
      icon: <CalendarFold className="text-muted-foreground h-4 w-4" />,
    },
  ];

  if (isLoading) return <CustomerLoadingPage />;
  if (isError) return <ErrorPage onRetry={refetch} />;

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <DetailsHeader title={customer!.name} description="Detalhes e histórico do cliente" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DetailsCard headerIcon={<User className="h-5 w-5" />} headerTitle="Informações de contato" fields={detailsCardFields} />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between text-primary">
              <CardTitle className="flex items-center gap-2">
                <Car />
                Veículos Cadastrados ({customer?.vehicles?.length})
              </CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="secondary" className="text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Veículo
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="">Adicionar novo veículo</DialogTitle>
                    <DialogDescription>
                      <span className="text-md">
                        Cliente: <b>{customer?.name}</b>
                      </span>
                    </DialogDescription>
                  </DialogHeader>
                  <VehicleForm customerId={customerId} isPending={createVehicleMutation.isPending} onSubmit={handleAddVehicle} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {customer?.vehicles?.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">Nenhum veículo cadastrado para este cliente.</p>
              ) : (
                <div className="md:grid-cols-2 grid max-h-[400px] grid-cols-2 gap-4 overflow-y-scroll">
                  {customer?.vehicles?.map((vehicle) => (
                    <CustomerVehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between text-primary">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Ordens de Serviço ({customer?.serviceOrders.length})
              </CardTitle>
              <Button size="sm" variant="secondary" onClick={() => router.push("/service-orders/new")} className="text-white">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar OS
              </Button>
            </CardHeader>
            <CardContent>
              <div className="max-h-[400px] overflow-y-scroll">
                {customer?.serviceOrders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhuma ordem de serviço encontrada para este cliente.</p>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {customer?.serviceOrders.map((order) => (
                      <ServiceOrderItem key={order.id} order={order} />
                    ))}
                  </Accordion>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
