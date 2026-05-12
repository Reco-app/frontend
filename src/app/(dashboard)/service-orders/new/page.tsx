"use client";
import { useServiceOrderMutations } from "@/hooks/use-service-orders";
import { useRouter } from "next/navigation";
import { ServiceOrderForm } from "../_components/ServiceOrderForm";
import { DetailsHeader } from "@/components/DetailsHeader";

export default function NewServiceOrderPage() {
  const router = useRouter();
  const { createMutation } = useServiceOrderMutations();

  const handleSubmit = (values: any) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        router.push("/service-orders");
      },
    });
  };

  return (
    <div className="container mx-auto py-10">
      <DetailsHeader title="Nova ordem de serviço" description="Preencha os campos abaixo para criar a OS" />
      <ServiceOrderForm onSubmit={handleSubmit} isPending={createMutation.isPending} />
    </div>
  );
}
