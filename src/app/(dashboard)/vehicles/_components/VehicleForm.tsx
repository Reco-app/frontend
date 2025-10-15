"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Spinner from "@/components/Spinner";
import { Vehicle } from "@/types/vehicle";
import { SelectInput } from "@/components/SelectInput";
import { useCustomer } from "@/hooks/use-customers";
import { useFipeCars } from "@/hooks/use-fipe-cars";
import OptionalBadge from "@/components/OptionalBadge";
import { invalidDateMessage } from "@/lib/schemaMessages";

const formSchema = z.object({
  plate: z.string().min(7, { message: "A placa deve ter pelo menos 7 caracteres." }).max(8),
  carBrand: z.string("Selecione uma marca."),
  carModel: z.string("Selecione um modelo."),
  year: z
    .transform(Number)
    .pipe(z.number("Ano inválido.").min(1950, { message: invalidDateMessage }))
    .optional(),
  color: z.string().optional(),
  ownerId: z.string("Selecione um cliente."),
});

interface VehicleFormProps {
  initialData?: Vehicle | null;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}

export function VehicleForm({ initialData, onSubmit, isPending }: VehicleFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      plate: "",
      carBrand: "",
      carModel: "",
      year: new Date().getFullYear(),
      color: "",
      ownerId: "",
    },
  });

  const { customers, isLoading: isLoadingCustomers } = useCustomer();
  const { fipeCars, isLoadingCars } = useFipeCars();

  const customerOptions = React.useMemo(() => {
    if (!customers) return [];
    return customers.map((c) => ({ label: `${c.name} - ${c.phone}`, value: c.id }));
  }, [customers]);

  const brandOptions = React.useMemo(() => {
    if (!fipeCars) return [];
    const brandSet = new Set(fipeCars.map((car) => car.brand));
    return Array.from(brandSet).map((brand) => ({ label: brand, value: brand }));
  }, [fipeCars]);

  const watchedBrand = form.watch("carBrand");

  const modelOptions = React.useMemo(() => {
    if (!fipeCars || !watchedBrand) return [];
    return fipeCars.filter((car) => car.brand === watchedBrand).map((car) => ({ label: car.model, value: car.model }));
  }, [fipeCars, watchedBrand]);

  React.useEffect(() => {
    form.resetField("carModel");
  }, [watchedBrand, form]);

  if (isLoadingCustomers || isLoadingCars) {
    return <Spinner />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente proprietário</FormLabel>
              <FormControl>
                <SelectInput
                  placeholder="Selecione o cliente"
                  searchPlaceholder="Buscar cliente..."
                  emptyMessage="Nenhum cliente encontrado."
                  options={customerOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="carBrand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <SelectInput
                    placeholder="Selecione a marca"
                    searchPlaceholder="Buscar marca..."
                    emptyMessage="Nenhuma marca encontrada."
                    options={brandOptions}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="carModel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <SelectInput
                    placeholder="Selecione o modelo"
                    searchPlaceholder="Buscar modelo..."
                    emptyMessage="Nenhum modelo encontrado."
                    options={modelOptions}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!watchedBrand}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa</FormLabel>
                <FormControl>
                  <Input placeholder="ABC1D23" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ano <OptionalBadge />
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Cor
                  <OptionalBadge />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Prata" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Spinner /> : "Salvar Veículo"}
        </Button>
      </form>
    </Form>
  );
}
