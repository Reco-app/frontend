"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Banknote, CalendarFold, Contact, FileText, Mail, MapPin, Phone, Plus, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate, formatDocument, formatPhone } from "@/lib/formatters";
import { Accordion } from "@/components/ui/accordion";
import { Employee } from "@/types/employee";
import ServiceItem from "../_components/ServiceItem";
import { DetailsHeader } from "@/components/DetailsHeader";
import { DetailsCard, DetailsCardFieldData } from "@/components/DetailsCard";
import EmployeeLoadingPage from "../_components/EmployeeLoadingPage";
import ErrorPage from "@/components/ErrorPage";

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
    refetch,
    isError,
  } = useQuery<Employee>({
    queryKey: ["employee", employeeId],
    queryFn: () => fetchEmployeeById(employeeId),
    enabled: !!employeeId,
  });

  const detailsCardFields: DetailsCardFieldData[] = [
    {
      label: "Nome do funcionário",
      value: employee?.name ?? "Não informado",
      icon: <Contact className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "N° do documento",
      value: employee?.documentId ? formatDocument(employee.documentId) : "Não informado",
      icon: <FileText className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "Salário",
      value: formatCurrency(employee?.salary ?? 0) || "Não informado",
      icon: <Banknote className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "N° do telefone",
      value: formatPhone(employee?.phone),
      icon: <Phone className="text-muted-foreground h-4 w-4" />,
    },
    {
      label: "Endereço",
      value: employee?.address || "Não informado",
      icon: <MapPin className="text-muted-foreground max-h-4 min-h-4 max-w-4 min-w-4" />,
    },
    {
      label: "Cadastro",
      value: employee?.updatedAt
        ? `Atualizado em ${formatDate(employee!.updatedAt!.toString() ?? formatDate(new Date().toString()))}`
        : "Não informado",
      icon: <CalendarFold className="text-muted-foreground h-4 w-4" />,
    },
  ];

  if (isLoading) return <EmployeeLoadingPage />;
  if (isError) return <ErrorPage onRetry={refetch} />;

  return (
    <div className="container mx-auto max-w-6xl p-6">
      <DetailsHeader title={employee!.name} description="Detalhes e histórico do funcionário" />
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <DetailsCard
            headerTitle="Informações de contato"
            headerIcon={<User className="h-5 w-5 text-muted-foreground" />}
            fields={detailsCardFields}
          />
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
                <p className="text-muted-foreground text-center py-8">Nenhuma ordem de serviço encontrada para este funcionário.</p>
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
