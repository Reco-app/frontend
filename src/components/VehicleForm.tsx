'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';

import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/Spinner';
import { SelectInput } from './SelectInput';

interface VehicleFormProps {
  customerId: string;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}

interface FipeCar {
  brand: string;
  model: string;
}

const formSchema = z.object({
  plate: z.string().min(7, { message: 'A placa deve ter no mínimo 7 caracteres.' }),
  carBrand: z.string().min(1, { message: 'Selecione uma marca.' }),
  carModel: z.string({ message: 'Selecione um modelo.' }),
  color: z.string().optional(),
  year: z.transform(Number).pipe(
    z
      .number()
      .min(1950, { message: 'Ano inválido.' })
      .max(new Date().getFullYear() + 1, { message: 'Ano não pode ser no futuro.' }),
  ),
});

const fetchFipeCars = async (): Promise<FipeCar[]> => {
  const { data } = await api.get('/cars');
  return data;
};

export function VehicleForm({ customerId, onSubmit, isPending }: VehicleFormProps) {
  const form = useForm<z.output<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { plate: '', color: '', year: 0 },
  });

  const { data: fipeCars, isLoading: isLoadingCars } = useQuery<FipeCar[]>({
    queryKey: ['fipeCars'],
    queryFn: fetchFipeCars,
  });

  const brands = React.useMemo(() => {
    if (!fipeCars) return [];
    const brandSet = new Set(fipeCars.map((car) => car.brand));
    return Array.from(brandSet).map((brand) => ({ label: brand, value: brand }));
  }, [fipeCars]);

  const watchedBrand = form.watch('carBrand');
  const models = React.useMemo(() => {
    if (!fipeCars || !watchedBrand) return [];
    return fipeCars.filter((car) => car.brand === watchedBrand).map((car) => ({ label: car.model, value: car.model }));
  }, [fipeCars, watchedBrand]);

  React.useEffect(() => {
    form.resetField('carModel');
  }, [watchedBrand, form]);

  if (isLoadingCars) {
    return <Spinner />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="carBrand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <FormControl>
                <SelectInput
                  value={field.value}
                  onChange={field.onChange}
                  options={brands}
                  placeholder="Selecione uma marca"
                  searchPlaceholder="Buscar marca..."
                  emptyMessage="Nenhuma marca encontrada."
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
                  value={field.value}
                  onChange={field.onChange}
                  options={models}
                  placeholder="Selecione um modelo"
                  searchPlaceholder="Buscar modelo..."
                  emptyMessage="Nenhum modelo encontrado."
                  disabled={!watchedBrand}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2025" {...field} />
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
                <FormLabel>Cor</FormLabel>
                <FormControl>
                  <Input placeholder="Prata" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending} className="mt-2 w-full">
          {isPending ? <Spinner message="Adicionando..." /> : 'Adicionar Veículo'}
        </Button>
      </form>
    </Form>
  );
}
