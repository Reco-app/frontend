"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Customer } from "@/types/customer";
import { useState } from "react";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import OptionalBadge from "@/components/OptionalBadge";
import { isRequiredFieldMessage } from "@/lib/schemaMessages";

interface CustomerFormProps {
  initialData?: Customer | null;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}

const formSchema = z.object({
  name: z.string().min(3, { message: isRequiredFieldMessage }),
  documentId: z.string().optional(),
  phone: z.string().min(10, { message: "Telefone inválido." }).optional(),
  email: z.email({ message: "Email inválido." }).optional().or(z.literal("")),
  address: z.string().optional(),
  zipCode: z.string().max(9, { message: "CEP inválido." }).optional(),
});

export function CustomerForm({ initialData, onSubmit, isPending }: CustomerFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      documentId: "",
      phone: "",
      email: "",
      address: "",
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do Cliente" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4 items-baseline">
          <FormField
            control={form.control}
            name="documentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  CPF/CNPJ
                  <OptionalBadge />
                </FormLabel>
                <FormControl>
                  <Input placeholder="N° Documento" {...field} />
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
                  <Input placeholder="N° Telefone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email
                <OptionalBadge />
              </FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
                      <div className="focus-within:ring-secondary/100 flex items-center rounded-md border-2 bg-white pr-4 shadow-xs focus-within:ring-[1px]">
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
                    <Input placeholder="Rua, número, bairro..." {...field} />
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
