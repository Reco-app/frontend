"use client";
import { useServiceOrderMutations } from "@/hooks/use-service-orders";
import { useRouter } from "next/navigation";
import { ServiceOrderForm } from "../_components/ServiceOrderForm";

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
      <h1 className="text-primary mb-4 text-2xl font-bold">Nova ordem de serviço (OS)</h1>
      <ServiceOrderForm onSubmit={handleSubmit} isPending={createMutation.isPending} />
    </div>
  );
}
