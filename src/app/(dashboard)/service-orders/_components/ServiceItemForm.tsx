"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SelectInput } from "@/components/SelectInput";
import { Button } from "@/components/ui/button";
import { Delete, Plus, Trash2 } from "lucide-react";
import { Employee } from "@/types/employee";
import { Part } from "@/types/inventory";
import { Separator } from "@/components/ui/separator";

interface ServiceItemProps {
  serviceIndex: number;
  removeService: (index: number) => void;
  employees?: Employee[];
  parts?: Part[];
}

export function ServiceItemForm({ serviceIndex, removeService, employees, parts }: ServiceItemProps) {
  const { control } = useFormContext();

  const {
    fields: partFields,
    append: appendPart,
    remove: removePart,
  } = useFieldArray({
    control,
    name: `services.${serviceIndex}.parts`,
  });

  const employeeOptions = employees?.map((e) => ({ label: e.name, value: e.id })) ?? [];
  const partOptions = parts?.map((p) => ({ label: `${p.name} | Estoque: ${p.quantity}`, value: p.id })) ?? [];

  return (
    <div className="p-6 border rounded-lg relative bg-muted/20">
      <div className="flex items-center w-[100%]">
        <div className="space-y-4 flex-1">
          <FormField
            name={`services.${serviceIndex}.name`}
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Serviço</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Troca de pastilhas de freio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4 items-baseline">
            <FormField
              name={`services.${serviceIndex}.employeeId`}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funcionário Responsável</FormLabel>
                  <FormControl>
                    <SelectInput options={employeeOptions} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`services.${serviceIndex}.laborCost`}
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custo Mão de Obra (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator className="my-4" />
          <div className="space-y-2 flex-1">
            <h4 className="text-sm font-medium text-primary">Peças Utilizadas</h4>
            {partFields.map((partField, partIndex) => (
              <div key={partField.id} className="grid gap-2 grid-cols-11 items-baseline">
                <FormField
                  name={`services.${serviceIndex}.parts.${partIndex}.partId`}
                  control={control}
                  render={({ field }) => (
                    <FormItem className="col-span-8">
                      <FormControl>
                        <SelectInput options={partOptions} placeholder="Selecione uma peça" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name={`services.${serviceIndex}.parts.${partIndex}.quantityUsed`}
                  control={control}
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <Input type="number" placeholder="Qtd." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="button" className="col-span-1 flex-1" variant="ghost" size="icon" onClick={() => removePart(partIndex)}>
                  <Delete />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendPart({ partId: "", quantityUsed: 1 })}>
              <Plus strokeWidth={3} className="mr-2 h-4 w-4" /> Adicionar Peça
            </Button>
          </div>
        </div>
        <div className="ml-6">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-red-100"
            onClick={() => removeService(serviceIndex)}
          >
            <Trash2 className="h-8 w-8 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}
