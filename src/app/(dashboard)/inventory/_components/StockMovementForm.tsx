"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useParts } from "@/hooks/use-parts";
import Spinner from "@/components/Spinner";
import { SelectInput } from "@/components/SelectInput";
import { InventoryMovement } from "@/types/inventory";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  partId: z.string("Selecione uma peça."),
  type: z.enum(["ENTRY", "EXIT"]),
  quantity: z.transform(Number).pipe(z.number("Obrigatório.").min(0, { message: "Deve ser positivo" })),
  reason: z.string().optional(),
});

interface StockMovementFormProps {
  initialData?: InventoryMovement;
  isPending: boolean;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export function StockMovementForm({ initialData, isPending, onSubmit }: StockMovementFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          type: "ENTRY",
          quantity: 0,
          reason: "",
        },
  });

  const { parts, isLoading } = useParts();

  const partOptions = React.useMemo(() => {
    if (!parts) return [];
    return parts.map((p) => ({
      value: p.id,
      label: `${p.name} (Cód: ${p.code}) | Estoque: ${p.quantity}`,
    }));
  }, [parts]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="partId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peça</FormLabel>
              <FormControl>
                <SelectInput
                  placeholder="Selecione a peça"
                  searchPlaceholder="Buscar por nome ou código..."
                  emptyMessage="Nenhuma peça encontrada."
                  options={partOptions}
                  value={field.value}
                  onChange={field.onChange}
                  className="rounded-md bg-accent"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Movimentação</FormLabel>
                <SelectInput
                  placeholder="Selecione o tipo"
                  searchPlaceholder="Buscar tipo..."
                  emptyMessage="Nenhum tipo encontrado."
                  options={[
                    { label: "Entrada", value: "ENTRY" },
                    { label: "Saída", value: "EXIT" },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                  className="bg-accent rounded-md"
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="10" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Motivo <Badge variant="outline">Opcional</Badge>
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: Compra do fornecedor X" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Spinner /> : "Registrar Movimentação"}
        </Button>
      </form>
    </Form>
  );
}
