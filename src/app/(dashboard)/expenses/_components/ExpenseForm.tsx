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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Expense } from "@/types/expense";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";
import { shouldBePositiveNumberMessage, isRequiredFieldMessage } from "@/lib/schemaMessages";
import OptionalBadge from "@/components/OptionalBadge";
import { SelectInput } from "@/components/SelectInput";

const expenseCategories = [
  { label: "Salários e Encargos", value: "Salários e Encargos" },
  { label: "Compra de Peças", value: "Compra de Peças" },
  { label: "Ferramentas e Equipamentos", value: "Ferramentas e Equipamentos" },
  { label: "Contas (Água, Luz, Internet)", value: "Contas (Água, Luz, Internet)" },
  { label: "Impostos e Taxas", value: "Impostos e Taxas" },
  { label: "Manutenção", value: "Manutenção Predial" },
  { label: "Despesas de Escritório", value: "Despesas de Escritório" },
  { label: "Outros", value: "Outros" },
];

const formSchema = z.object({
  name: z.string().min(1, isRequiredFieldMessage),
  category: z.string().min(1, isRequiredFieldMessage),
  value: z.transform(Number).pipe(z.number({ error: isRequiredFieldMessage }).min(0, { message: shouldBePositiveNumberMessage })),
  date: z.date({ error: isRequiredFieldMessage }),
  isRecurring: z.boolean(),
  observations: z.string().optional(),
});

interface ExpenseFormProps {
  initialData?: Expense | null;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}

export function ExpenseForm({ initialData, onSubmit, isPending }: ExpenseFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          date: new Date(initialData.date),
        }
      : {
          category: "",
          value: 0,
          date: new Date(),
          isRecurring: false,
          observations: "",
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4 items-baseline">
          <FormField
            control={form.control}
            name="name"
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                  <SelectInput
                    options={expenseCategories}
                    placeholder="Selecione uma categoria"
                    searchPlaceholder="Buscar categoria..."
                    emptyMessage="Nenhuma categoria encontrada."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 items-baseline">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor (R$)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Ex: 850.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Despesa</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("bg-white h-10 hover:bg-white pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
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
        </div>

        <FormField
          control={form.control}
          name="isRecurring"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-3 shadow-xs mt-6 bg-white">
              <div className="space-y-0.5">
                <FormLabel>Despesa Recorrente (Mensal)?</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
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
                <Textarea placeholder="Detalhes adicionais sobre a despesa..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? "Salvando..." : "Salvar Despesa"}
        </Button>
      </form>
    </Form>
  );
}
