"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Bill } from "@/types/bill"; // Importe o tipo Bill
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import { shouldBePositiveNumberMessage, isRequiredFieldMessage } from "@/lib/schemaMessages";
import OptionalBadge from "@/components/OptionalBadge";
import Spinner from "@/components/Spinner";

// Schema Zod para validação do formulário de Boleto
const formSchema = z.object({
  description: z.string().min(1, isRequiredFieldMessage),
  supplier: z.string().optional(),
  value: z.transform(Number).pipe(z.number("Obrigatório.").min(0, { message: "Deve ser positivo" })),
  emissionDate: z.date({ error: isRequiredFieldMessage }),
  dueDate: z.date({ error: isRequiredFieldMessage }),
  barcode: z.string().optional(),
  observations: z.string().optional(),
});

interface BillFormProps {
  initialData?: Bill | null;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}

export function BillForm({ initialData, onSubmit, isPending }: BillFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          emissionDate: new Date(initialData.emissionDate), // Converte string ISO para objeto Date
          dueDate: new Date(initialData.dueDate), // Converte string ISO para objeto Date
        }
      : {
          description: "",
          supplier: "",
          value: 0,
          emissionDate: new Date(),
          dueDate: new Date(), // Padrão para hoje, o usuário deve alterar
          barcode: "",
          observations: "",
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Aluguel - Outubro 2025" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="supplier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Fornecedor <OptionalBadge />
              </FormLabel>
              <FormControl>
                <Input placeholder="Nome do fornecedor ou empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Ex: 2500.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="emissionDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Emissão</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn("pl-3 text-left font-normal bg-white h-10", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? formatDate(field.value.toString()) : <span>Selecione a data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Vencimento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                        {field.value ? formatDate(field.value.toString()) : <span>Selecione a data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Código de Barras <OptionalBadge />
              </FormLabel>
              <FormControl>
                <Input placeholder="Digite ou cole o código de barras" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="observations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Observações <OptionalBadge />
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Detalhes adicionais sobre este boleto..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Spinner /> : "Salvar Boleto"}
        </Button>
      </form>
    </Form>
  );
}
