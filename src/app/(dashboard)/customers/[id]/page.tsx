"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Customer } from "@/types/customer";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CalendarFold,
  Car,
  CheckCircle,
  Clock,
  FileText,
  Mail,
  MapPin,
  Phone,
  Plus,
  User,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Spinner from "@/components/Spinner";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { VehicleForm } from "@/components/VehicleForm";
import { AxiosError } from "axios";
import { capitalize, formatCurrency, formatDate } from "@/lib/formatters";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ServiceOrder, ServiceOrderStatus } from "@/types/service-order";

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

  if (isLoading) return <Spinner />;
  if (isError) return <div>Erro ao buscar dados do cliente.</div>;

  console.log(customer);

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-8 w-8" />
        </Button>
        <div>
          <h1 className="text-primary mb-1 text-2xl font-bold">{customer?.name}</h1>
          <p className="text-muted-foreground">Detalhes e histórico do cliente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Documento</p>
                  <p className="text-muted-foreground text-sm">{customer?.documentId || "Não informado."}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Telefone</p>
                  <p className="text-muted-foreground text-sm">{customer?.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Email</p>
                  <p className="text-muted-foreground text-sm">{customer?.email || "Não informado."}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-muted-foreground max-h-4 min-h-4 max-w-4 min-w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Endereço</p>
                  <p className="text-muted-foreground text-sm">{customer?.address || "Não informado."}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarFold className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Cadastro</p>
                  <p className="text-muted-foreground text-sm">
                    {customer?.updatedAt ? `Atualizado em ${formatDate(customer.updatedAt.toString())}` : "Não informado."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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
                    <Card key={vehicle.id} className="bg-muted/30 py-2">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="text-primary font-bold text-sm flex flex-col">
                            <span className="text-primary/60">{vehicle.carBrand}</span>
                            <span>{vehicle.carModel}</span>
                          </h4>
                          <Badge variant="outline" className="text-primary">
                            {vehicle.year}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground space-y-1 text-sm">
                          <p>
                            <span className="font-semibold">Placa:</span> {vehicle.plate}
                          </p>
                          <p>
                            <span className="font-semibold">Cor:</span> {vehicle.color || "Não informada."}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
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
              <Button size="sm" variant="secondary" className="text-white">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Veículo
              </Button>
            </CardHeader>
            <CardContent>
              {customer?.serviceOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhuma ordem de serviço encontrada para este cliente.</p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {customer?.serviceOrders.map((order) => (
                    <AccordionItem key={order.id} value={order.id}>
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center justify-between w-full pr-4">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(order.status)}
                            <div className="text-left font-medium">
                              <span className="text-primary/70 border-r-3 border-primary/20 pr-2">OS #{order.id.split("-")[0]}</span>
                              <span className="text-primary pl-2">
                                {order.vehicle?.carBrand} {order.vehicle?.carModel}
                              </span>
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
                              <h5 className="font-medium mb-2 text-foreground">Datas</h5>
                              <div className="space-y-1 text-sm">
                                <p className="flex items-center gap-2 text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span className="font-medium">Criado:</span> {formatDate(order.createdAt)}
                                </p>
                                <p className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span className="font-medium">Atualizado:</span> {formatDate(order.updatedAt)}
                                </p>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium mb-2 text-foreground">Serviços</h5>
                              <ul className="space-y-1 text-sm">
                                {order.services?.map((service, index) => (
                                  <li key={index} className="flex items-center gap-2 list-disc">
                                    <span className="font-semibold">-</span>
                                    <span>{capitalize(service.name)}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {order.problemDescription && (
                            <div>
                              <h5 className="font-medium mb-2">Observações</h5>
                              <p className="text-sm text-muted-foreground bg-muted/60 border p-3 rounded-md">
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
