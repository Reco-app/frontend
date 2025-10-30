"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BanknoteArrowUp,
  CalendarFold,
  Car,
  CarFront,
  Contact,
  Factory,
  FileText,
  IdCard,
  MapPin,
  Phone,
  Plus,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Spinner from "@/components/Spinner";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { Accordion } from "@/components/ui/accordion";
import { Employee } from "@/types/employee";
import ServiceItem from "../_components/ServiceItem";
import { Separator } from "@/components/ui/separator";

const fetchEmployeeById = async (id: string): Promise<Employee> => {
  const { data } = await api.get(`/employees/${id}`);
  return data;
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const employeeId = params.id as string;

  const router = useRouter();

  const {
    data: employee,
    isLoading,
    isError,
  } = useQuery<Employee>({
    queryKey: ["employee", employeeId],
    queryFn: () => fetchEmployeeById(employeeId),
    enabled: !!employeeId,
  });

  if (isLoading) return <Spinner />;
  if (isError) return <div>Erro ao buscar dados do funcionário.</div>;

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-8 w-8" />
        </Button>
        <div>
          <h1 className="text-primary mb-1 text-xl font-bold">{employee?.name}</h1>
          <p className="text-muted-foreground">Detalhes e histórico do funcionário</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
              <Separator className="mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Contact className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Nome do funcionário</p>
                  <p className="text-muted-foreground text-sm">{employee?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">N° do documento</p>
                  <p className="text-muted-foreground text-sm">{employee?.documentId || "Não informado."}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <BanknoteArrowUp className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Salário</p>
                  <p className="text-muted-foreground text-sm">{employee?.salary && formatCurrency(employee?.salary)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">N° de telefone</p>
                  <p className="text-muted-foreground text-sm">{employee?.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-muted-foreground max-h-4 min-h-4 max-w-4 min-w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Endereço</p>
                  <p className="text-muted-foreground text-sm">{employee?.address || "Não informado."}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarFold className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Cadastro</p>
                  <p className="text-muted-foreground text-sm">
                    {employee?.updatedAt ? `Atualizado em ${formatDate(employee.updatedAt.toString())}` : "Não informado."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex items-center justify-between text-primary">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Serviços realizados ({employee?.services.length})
              </CardTitle>
              <Button size="sm" variant="secondary" className="text-white" onClick={() => router.push("/service-orders/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar OS
              </Button>
            </CardHeader>
            <CardContent>
              {employee?.services.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhuma ordem de serviço encontrada para este cliente.</p>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {employee?.services.map((service) => (
                    <ServiceItem key={service.id} service={service} />
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
