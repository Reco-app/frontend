"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Employee, EmployeeRole } from "@/types/employee";
import { SelectInput } from "@/components/SelectInput";
import { toast } from "sonner";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import OptionalBadge from "@/components/OptionalBadge";
import { shouldBePositiveNumberMessage, isRequiredFieldMessage } from "@/lib/schemaMessages";

interface EmployeeFormProps {
  initialData?: Employee | null;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}

const formSchema = z.object({
  name: z.string().min(3, { message: isRequiredFieldMessage }),
  documentId: z.string().length(11, { message: "O CPF deve ter 11 dígitos." }),
  phone: z.string().min(10, { message: "Telefone inválido." }),
  address: z.string().optional(),
  zipCode: z.string().max(9, { message: "CEP inválido." }).optional(),
  salary: z
    .transform(Number)
    .pipe(
      z
        .number({ error: isRequiredFieldMessage })
        .min(0, { message: shouldBePositiveNumberMessage })
        .max(10000, { message: "Salário inválido" })
    ),
  role: z.string(isRequiredFieldMessage),
});

export function EmployeeForm({ initialData, onSubmit, isPending }: EmployeeFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      documentId: "",
      phone: "",
      address: "",
      salary: 0,
      zipCode: "",
    },
  });

  const [isFetchingZipCode, setIsFetchingZipCode] = useState(false);

  const handleCepBlur = async (cep: string) => {
    const cleanedCep = cep.replace(/\D/g, "");

    if (cleanedCep.length !== 8) {
      return;
    }

    setIsFetchingZipCode(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cleanedCep}`);
      if (!response.ok) {
        toast.error("CEP não encontrado");
        return;
      }
      const data = await response.json();
      const address = `${data.street}, ${data.neighborhood} - ${data.city}, ${data.state}`;
      form.setValue("address", address);
    } catch (error) {
      toast.error("Falha ao buscar CEP");
      form.setError("zipCode", { message: "Não encontrado." });
    } finally {
      setIsFetchingZipCode(false);
    }
  };

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const { zipCode, ...dataForBackend } = values;

    onSubmit(dataForBackend);
  };

  const roleOptions = Object.entries(EmployeeRole).map(([key, value]) => ({ label: value, value: key }));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="ex: José da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 items-baseline gap-4">
          <FormField
            control={form.control}
            name="documentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input placeholder="ex: 000.000.000-00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="ex: 00 98765-4321" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 items-baseline gap-4">
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salário (R$)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="3500.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <SelectInput
                    value={field.value}
                    onChange={field.onChange}
                    options={roleOptions}
                    placeholder="Selecione um cargo"
                    searchPlaceholder="Buscar cargo..."
                    emptyMessage="Nenhum cargo encontrado."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-10 items-center gap-4">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <div className="flex">
                  <FormItem>
                    <FormLabel>
                      CEP
                      <OptionalBadge />
                    </FormLabel>
                    <FormControl>
                      <div className="focus-within:ring-secondary/100 border-2 flex items-center rounded-md bg-input pr-4 shadow-xs focus-within:ring-[1px]">
                        <Input
                          className="border-0 bg-none shadow-none focus-visible:ring-[0px]"
                          placeholder="00000-000"
                          {...field}
                          onBlur={(e) => handleCepBlur(e.target.value)}
                          disabled={isFetchingZipCode}
                        />
                        {isFetchingZipCode && <Spinner />}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
          </div>
          <div className="col-span-7">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Endereço
                    <OptionalBadge />
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Endereço" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={isPending} className="mt-2 w-full">
          {isPending ? <Spinner /> : "Salvar"}
        </Button>
      </form>
    </Form>
  );
}
