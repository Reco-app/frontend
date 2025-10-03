'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarFold, FileText, Mail, MapPin, Phone, Plus, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Spinner from '@/components/Spinner';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { VehicleForm } from '@/components/VehicleForm';
import { AxiosError } from 'axios';
import { formatDate } from '@/lib/formatters';

const fetchCustomerById = async (id: string): Promise<Customer> => {
  const { data } = await api.get(`/customers/${id}`);
  return data;
};

const createVehicle = (vehicleData: any) => api.post('/vehicles', vehicleData);

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
    queryKey: ['customer', customerId],
    queryFn: () => fetchCustomerById(customerId),
    enabled: !!customerId,
  });

  const createVehicleMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', customerId] });
      toast.success('Veículo adicionado com sucesso.');
      setIsDialogOpen(false);
    },
    onError: (err: AxiosError) => {
      const error: any = err.response?.data;
      toast.error(error.message || 'Não foi possível adicionar o veículo.');
    },
  });

  const handleAddVehicle = (values: any) => {
    createVehicleMutation.mutate({ ...values, ownerId: customerId });
  };

  if (isLoading) return <Spinner />;
  if (isError) return <div>Erro ao buscar dados do cliente.</div>;

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-primary/5 p-2 hover:cursor-pointer"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-8 w-8" />
          </Button>
          <div>
            <h1 className="text-foreground text-3xl font-bold">{customer?.name}</h1>
            <p className="text-muted-foreground mt-2">Detalhes e histórico do cliente</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nova Ordem de Serviço
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Informações de Contato */}
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
                  <p className="text-muted-foreground text-sm">{customer?.documentId || 'Não informado.'}</p>
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
                  <p className="text-muted-foreground text-sm">{customer?.email || 'Não informado.'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-muted-foreground max-h-4 min-h-4 max-w-4 min-w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Endereço</p>
                  <p className="text-muted-foreground text-sm">{customer?.address || 'Não informado.'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarFold className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Cadastro</p>
                  <p className="text-muted-foreground text-sm">
                    {customer?.updatedAt
                      ? `Atualizado em ${formatDate(customer.updatedAt.toString())}`
                      : 'Não informado.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
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
                      <span className="text-md">Adicionar veículo para o cliente {customer?.name}</span>
                    </DialogDescription>
                  </DialogHeader>
                  <VehicleForm
                    customerId={customerId}
                    isPending={createVehicleMutation.isPending}
                    onSubmit={handleAddVehicle}
                  />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {customer?.vehicles?.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center">Nenhum veículo cadastrado para este cliente.</p>
              ) : (
                <div className="md:grid-cols- grid max-h-[400px] grid-cols-2 gap-4 overflow-y-scroll">
                  {customer?.vehicles?.map((vehicle) => (
                    <Card key={vehicle.id} className="border-border hover:bg-muted hover:text-secondary py-2">
                      <CardContent className="hover:text-secondary p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="text-primary font-semibold">
                            {vehicle.carBrand} {vehicle.carModel}
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
                            <span className="font-semibold">Cor:</span> {vehicle.color || 'Não informada.'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
