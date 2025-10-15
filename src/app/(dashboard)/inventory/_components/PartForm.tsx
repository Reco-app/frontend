"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Part } from "@/types/inventory";
import { useFipeCars } from "@/hooks/use-fipe-cars";
import Spinner from "@/components/Spinner";
import { Switch } from "@/components/ui/switch";
import MultiSelect from "@/components/MultiSelect";
import { invalidValueMessage, isPositiveNumberMessage, isRequiredFieldMessage } from "@/lib/schemaMessages";

const formSchema = z.object({
  code: z.string().min(1, isRequiredFieldMessage),
  name: z.string().min(1, isRequiredFieldMessage),
  manufacturer: z.string().min(1, isRequiredFieldMessage),
  purchasePrice: z
    .transform(Number)
    .pipe(z.number("Obrigatório.").min(0, { message: isPositiveNumberMessage }).max(10000, { message: invalidValueMessage })),
  salePrice: z
    .transform(Number)
    .pipe(z.number("Obrigatório.").min(0, { message: isPositiveNumberMessage }).max(10000, { message: invalidValueMessage })),
  initialQuantity: z
    .transform(Number)
    .pipe(z.number("Obrigatório.").min(0, { message: isPositiveNumberMessage }))
    .optional(),
  minimumStock: z.transform(Number).pipe(z.number({ error: isRequiredFieldMessage }).min(0, { message: isPositiveNumberMessage })),
  isGeneralUse: z.boolean().default(true).optional(),
  compatibleCars: z.array(z.object({ brand: z.string(), model: z.string() })).optional(),
});

interface PartFormProps {
  initialData?: Part | null;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}

export function PartForm({ initialData, onSubmit, isPending }: PartFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      code: "",
      name: "",
      manufacturer: "",
      isGeneralUse: true,
      purchasePrice: 0,
      salePrice: 0,
      initialQuantity: 0,
      minimumStock: 5,
    },
  });

  const { fipeCars, isLoadingCars } = useFipeCars();
  const carOptions = React.useMemo(
    () =>
      fipeCars?.map((c) => ({
        value: `${c.brand}__${c.model}`,
        label: `${c.brand} ${c.model}`,
      })) || [],
    [fipeCars]
  );

  const isGeneralUse = form.watch("isGeneralUse");

  const handleMultiSelectChange = React.useCallback(
    (selectedValues: string[]) => {
      const formattedForForm = selectedValues.map((value) => {
        const [brand, model] = value.split("__");
        return { brand, model };
      });
      form.setValue("compatibleCars", formattedForForm, { shouldValidate: true });
    },
    [form]
  );

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const { ...dataForBackend } = values;
    console.log(dataForBackend);
    onSubmit(dataForBackend);
  };

  if (isLoadingCars && !isGeneralUse) {
    return <Spinner message="Carregando lista de carros..." />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Peça</FormLabel>
              <FormControl>
                <Input placeholder="Filtro de Óleo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código</FormLabel>
                <FormControl>
                  <Input placeholder="EX-12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fabricante</FormLabel>
                <FormControl>
                  <Input placeholder="Tecfil" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Compra (R$)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="15.50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Venda (R$)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="30.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="initialQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{initialData ? "Quantidade Atual" : "Quantidade Inicial"}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={initialData?.quantity.toString() ?? "0"} {...field} disabled={!!initialData} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minimumStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estoque Mínimo</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isGeneralUse"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border px-4 h-12 shadow-xs mt-6 bg-card">
              <div className="space-y-0.5">
                <FormLabel>Peça de uso geral?</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} className="py-0" />
              </FormControl>
            </FormItem>
          )}
        />

        {!isGeneralUse && (
          <div className="max-w-[100%]">
            <FormField
              control={form.control}
              name="compatibleCars"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carros Compatíveis</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={carOptions}
                      placeholder="Selecione os carros compatíveis..."
                      isLoading={isLoadingCars}
                      value={field.value?.map((car) => `${car.brand}__${car.model}`) ?? []}
                      onChange={handleMultiSelectChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Spinner /> : "Salvar Peça"}
        </Button>
      </form>
    </Form>
  );
}
