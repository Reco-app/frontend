"use client";

import { useParams, useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import { useServiceOrderById, useServiceOrderMutations } from "@/hooks/use-service-orders";
import { ServiceOrderForm } from "../../_components/ServiceOrderForm";

export default function EditServiceOrderPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { data: order, isLoading, isError } = useServiceOrderById(id);

  const { updateMutation } = useServiceOrderMutations();

  const handleSubmit = (values: any) => {
    updateMutation.mutate(
      { id, data: values },
      {
        onSuccess: () => {
          router.push(`/service-orders/${id}`);
        },
      }
    );
  };

  if (isLoading) return <Spinner message="Carregando dados da Ordem de Serviço..." />;
  if (isError) return <div>Erro ao carregar os dados para edição.</div>;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-primary mb-4 text-2xl font-bold">Editar Ordem de Serviço #{id.substring(0, 8).toUpperCase()}</h1>
      <ServiceOrderForm initialData={order} onSubmit={handleSubmit} isPending={updateMutation.isPending} />
    </div>
  );
}
