"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, Control, UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { CalendarIcon, CreditCard, FileUser, Plus, Trash, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { ServiceOrder, PaymentMethod, ServiceOrderStatus } from "@/types/service-order";
import { useParts } from "@/hooks/use-parts";
import { useEmployee } from "@/hooks/use-employees";
import { useVehicle } from "@/hooks/use-vehicles";
import { useCustomer } from "@/hooks/use-customers";
import { SelectInput } from "@/components/SelectInput";
import Spinner from "@/components/Spinner";
import { ServiceItemForm } from "./ServiceItemForm";
import { Textarea } from "@/components/ui/textarea";
import { shouldBePositiveNumberMessage, isRequiredFieldMessage } from "@/lib/schemaMessages";
import { Separator } from "@/components/ui/separator";
import OptionalBadge from "@/components/OptionalBadge";

const formSchema = z.object({
  customerId: z.uuid("Selecione um cliente."),
  vehicleId: z.uuid("Selecione um veículo."),
  entryDate: z.date(isRequiredFieldMessage),
  predictedExitDate: z.date().optional(),
  problemDescription: z.string().optional(),
  status: z.enum(ServiceOrderStatus, "Selecione um status."),
  discount: z.transform(Number).pipe(z.number({ error: isRequiredFieldMessage }).min(0, { message: shouldBePositiveNumberMessage })),
  services: z
    .array(
      z.object({
        name: z.string().min(1, isRequiredFieldMessage),
        employeeId: z.uuid("Selecione um funcionário."),
        laborCost: z.transform(Number).pipe(z.number({ error: isRequiredFieldMessage }).min(0, { message: shouldBePositiveNumberMessage })),
        parts: z
          .array(
            z.object({
              partId: z.uuid(),
              quantityUsed: z
                .transform(Number)
                .pipe(z.number({ error: isRequiredFieldMessage }).min(0, { message: shouldBePositiveNumberMessage })),
            })
          )
          .optional(),
      })
    )
    .optional(),
  payments: z
    .array(
      z.object({
        method: z.enum(PaymentMethod),
        amount: z.transform(Number).pipe(z.number({ error: isRequiredFieldMessage }).min(0, { message: shouldBePositiveNumberMessage })),
        date: z.date(isRequiredFieldMessage).optional(),
        installments: z
          .transform(Number)
          .pipe(z.number({ error: isRequiredFieldMessage }).min(0, { message: shouldBePositiveNumberMessage }))
          .optional(),
      })
    )
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

const statusMap: Record<ServiceOrderStatus, { label: string }> = {
  AWAITING_APPROVAL: { label: "Aguardando Aprovação" },
  APPROVED: { label: "Aprovada" },
  IN_PROGRESS: { label: "Em Andamento" },
  FINISHED: { label: "Finalizada" },
  CANCELED: { label: "Cancelada" },
};

interface GeneralInfoSectionProps {
  form: UseFormReturn<FormValues>;
  customers: any[];
  vehicleOptions: { label: string; value: string }[];
  watchedCustomerId: string;
}

function GeneralInfoSection({ form, customers, vehicleOptions, watchedCustomerId }: GeneralInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center text-primary">
          <FileUser className="mr-2" />
          <CardTitle>Informações Gerais</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
          <FormField
            name="customerId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <SelectInput options={customers?.map((c) => ({ label: `${c.name} | ${c.phone}`, value: c.id })) ?? []} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="vehicleId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Veículo</FormLabel>
                <FormControl>
                  <SelectInput options={vehicleOptions} {...field} disabled={!watchedCustomerId} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          name="problemDescription"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Descrição do Problema (Relato do Cliente)
                <OptionalBadge />
              </FormLabel>
              <FormControl>
                <Textarea placeholder="Ex: Barulho na suspensão, luz de injeção acesa..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-baseline">
          <FormField
            name="entryDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Entrada</FormLabel>
                <Popover>
                  <PopoverTrigger asChild className="bg-white h-10">
                    <FormControl>
                      <Button variant="outline" className={cn(!field.value && "text-muted-foreground")}>
                        {field.value ? formatDate(field.value.toISOString()) : <span className="font-normal">Selecione a data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="predictedExitDate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>
                  Data de Saída <OptionalBadge />
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild className="bg-white h-10">
                    <FormControl>
                      <Button variant="outline" className={cn(!field.value && "text-muted-foreground")}>
                        {field.value ? formatDate(field.value.toISOString()) : <span className="font-normal">Selecione a data</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="status"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <SelectInput
                  options={Object.values(ServiceOrderStatus).map((status) => ({ label: statusMap[status].label, value: status }))}
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface ServicesSectionProps {
  control: Control<FormValues>;
  employees: any[];
  parts: any[];
}

function ServicesSection({ control, employees, parts }: ServicesSectionProps) {
  const { fields, append, remove } = useFieldArray({ control, name: "services" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <div className="flex items-center text-primary">
            <Wrench className="mr-2" />
            <span className="text-md">Serviços Executados</span>
          </div>
        </CardTitle>
        <Button type="button" variant="secondary" size="sm" onClick={() => append({ name: "", employeeId: "", laborCost: 0, parts: [] })}>
          <Plus strokeWidth={3} className="mr-2 h-4 w-4" /> Adicionar Serviço
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <ServiceItemForm key={field.id} serviceIndex={index} removeService={remove} employees={employees} parts={parts} />
        ))}
        {fields.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nenhum serviço adicionado.</p>}
      </CardContent>
    </Card>
  );
}

const paymentMethodMap: Record<PaymentMethod, { label: string }> = {
  CREDIT_CARD: { label: "Cartão de Crédito" },
  DEBIT_CARD: { label: "Cartão de Débito" },
  PIX: { label: "PIX" },
  CASH: { label: "Dinheiro" },
  BANK_TRANSFER: { label: "Transferência" },
};

interface FinancialSectionProps {
  form: UseFormReturn<FormValues>;
  totalAmount: number;
  totalPaid: number;
  balance: number;
}

function FinancialSection({ form, totalAmount, totalPaid, balance }: FinancialSectionProps) {
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "payments" });
  const watchedDiscount = form.watch("discount");

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4 pr-6 border-r-2">
            <div className="flex items-center justify-between">
              <div className="flex text-primary">
                <CreditCard className="mr-2" />
                <h3 className="font-semibold">Pagamentos</h3>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => append({ method: PaymentMethod.PIX, amount: 0, installments: 1, date: new Date() })}
              >
                <Plus className="mr-2 h-4 w-4" /> Adicionar Pagamento
              </Button>
            </div>
            <div className="space-y-3 py-2">
              {fields.map((field, index) => {
                const watchedPaymentMethod = form.watch(`payments.${index}.method`);
                return (
                  <div key={field.id} className="grid grid-cols-9 gap-2 items-start p-3 border rounded-lg bg-muted/30">
                    <FormField
                      control={form.control}
                      name={`payments.${index}.method`}
                      render={({ field }) => (
                        <FormItem className="col-span-3">
                          <FormLabel>Método</FormLabel>
                          <SelectInput
                            options={Object.values(PaymentMethod).map((method) => ({
                              label: paymentMethodMap[method].label,
                              value: method,
                            }))}
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`payments.${index}.amount`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Valor</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Valor (R$)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {watchedPaymentMethod === PaymentMethod.CREDIT_CARD && (
                      <FormField
                        control={form.control}
                        name={`payments.${index}.installments`}
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel>Parcelas</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="Parcelas" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <FormField
                      name={`payments.${index}.date`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="flex flex-col col-span-2">
                          <FormLabel>Realizado em</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild className="bg-white h-10">
                              <FormControl>
                                <Button variant="outline" className={cn(!field.value && "text-muted-foreground")}>
                                  {field.value ? (
                                    formatDate(field.value.toISOString())
                                  ) : (
                                    <span className="font-normal">Selecione a data</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="col-span-1 col-start-9 flex flex-col items-center justify-end flex-1">
                      <FormLabel className="text-transparent">Excluir</FormLabel>
                      <Button type="button" variant="ghost" size="icon" className="hover:bg-red-100" onClick={() => remove(index)}>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {fields.length === 0 && <p className="text-sm text-muted-foreground text-center py-16">Nenhum pagamento adicionado.</p>}
            </div>
          </div>
          <div className="space-y-4 bg-muted/30 p-8 rounded-md border">
            <FormField
              name="discount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Desconto (R$) <OptionalBadge />
                  </FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <div className="space-y-2 text-right">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground text">Subtotal</span>
                <span className="text-primary">{formatCurrency(totalAmount + Number(watchedDiscount || 0))}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Desconto</span>
                <span className="text-primary">- {formatCurrency(Number(watchedDiscount || 0))}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-primary">Total</span>
                <span className="text-primary">{formatCurrency(totalAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Pago</span>
                <span className="text-primary">{formatCurrency(totalPaid)}</span>
              </div>
              <div className="flex justify-between items-center text-md font-bold">
                <span className={cn(balance > 0 ? "text-destructive" : "text-green-500")}>Saldo</span>
                <span className={cn(balance > 0 ? "text-destructive" : "text-green-500")}>{formatCurrency(balance)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ServiceOrderFormProps {
  initialData?: ServiceOrder | null;
  onSubmit: (values: FormValues) => void;
  isPending: boolean;
}

export function ServiceOrderForm({ initialData, onSubmit, isPending }: ServiceOrderFormProps) {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          entryDate: new Date(initialData.entryDate),
          predictedExitDate: initialData.predictedExitDate ? new Date(initialData.predictedExitDate) : undefined,
          discount: initialData.discount ?? 0,
          payments: initialData.payments?.map((p) => ({ ...p, date: new Date(p.date) })) ?? [],
          services:
            initialData.services?.map((service) => ({
              ...service,
              parts:
                service.partsUsed?.map((partUsage) => ({
                  partId: partUsage.part.id,
                  quantityUsed: partUsage.quantityUsed,
                })) ?? [],
            })) ?? [],
        }
      : {
          customerId: "",
          vehicleId: "",
          entryDate: new Date(),
          status: ServiceOrderStatus.AWAITING_APPROVAL,
          discount: 0,
          services: [],
          payments: [],
          problemDescription: "",
          predictedExitDate: undefined,
        },
  });

  const { customers, isLoading: isLoadingCustomers } = useCustomer();
  const { vehicles, isLoading: isLoadingVehicles } = useVehicle();
  const { employees, isLoading: isLoadingEmployees } = useEmployee();
  const { parts, isLoading: isLoadingParts } = useParts();

  const { errors } = form.formState;
  React.useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log("ERROS DE VALIDAÇÃO DO FORMULÁRIO:", errors);
    }
  }, [errors]);

  const watchedCustomerId = form.watch("customerId");
  const vehicleOptions = React.useMemo(() => {
    if (!vehicles || !watchedCustomerId) return [];
    return vehicles
      .filter((v) => v.ownerId === watchedCustomerId)
      .map((v) => ({ label: `${v.carBrand} ${v.carModel} - ${v.plate}`, value: v.id }));
  }, [vehicles, watchedCustomerId]);

  React.useEffect(() => {
    form.resetField("vehicleId");
  }, [watchedCustomerId, form]);

  const watchedServices = form.watch("services");
  const watchedDiscount = form.watch("discount");
  const watchedPayments = form.watch("payments");

  let subtotal = 0;
  if (Array.isArray(watchedServices)) {
    for (const service of watchedServices) {
      subtotal += Number(service.laborCost) || 0;
      if (service.parts) {
        for (const partUsage of service.parts) {
          const partData = parts?.find((p) => p.id === partUsage.partId);
          if (partData) {
            subtotal += partData.salePrice * (Number(partUsage.quantityUsed) || 0);
          }
        }
      }
    }
  }

  const totalAmount = subtotal - (Number(watchedDiscount) || 0) > 0 ? subtotal - (Number(watchedDiscount) || 0) : 0;
  const totalPaid = (watchedPayments ?? []).reduce((acc, payment) => acc + Number(payment.amount || 0), 0);
  const balance = totalAmount - totalPaid;

  const isLoading = isLoadingCustomers || isLoadingVehicles || isLoadingEmployees || isLoadingParts;
  if (isLoading) return <Spinner message="Carregando dados necessários..." />;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <GeneralInfoSection form={form} customers={customers ?? []} vehicleOptions={vehicleOptions} watchedCustomerId={watchedCustomerId} />
        <ServicesSection control={form.control} employees={employees ?? []} parts={parts ?? []} />
        <FinancialSection form={form} totalAmount={totalAmount} totalPaid={totalPaid} balance={balance} />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Spinner /> : "Salvar Ordem de Serviço"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
