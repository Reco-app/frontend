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
import { MonetaryInput } from "@/components/MonetaryInput";

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
      <div className="grid grid-cols-4 gap-4 w-[100%] items-baseline">
        <div className="col-span-2">
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
        </div>
        <div className="col-span-1">
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
        </div>

        <div className="col-span-1 flex items-end">
          <FormField
            name={`services.${serviceIndex}.laborCost`}
            control={control}
            render={({ field }) => (
              <FormItem className="w-[85%]">
                <FormLabel>Custo Mão de Obra (R$)</FormLabel>
                <FormControl>
                  <MonetaryInput type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="rounded-md h-10 w-10 bg-red-300/30 flex items-center justify-center ml-4">
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
      <div className="space-y-2 flex-1 w-[50%] mt-4">
        <h4 className="text-sm font-medium text-primary">Peças Utilizadas</h4>
        {partFields.map((partField, partIndex) => (
          <div key={partField.id} className="grid gap-2 grid-cols-7 items-baseline">
            <FormField
              name={`services.${serviceIndex}.parts.${partIndex}.partId`}
              control={control}
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormControl>
                    <SelectInput options={partOptions} placeholder="Selecione uma peça" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex col-span-2">
              <FormField
                name={`services.${serviceIndex}.parts.${partIndex}.quantityUsed`}
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="number" placeholder="Qtd." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="button"
                variant="ghost"
                className="h-10 w-10 bg-red-300/30 ml-2 "
                size="icon"
                onClick={() => removePart(partIndex)}
              >
                <Delete className="text-red-500" />
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => appendPart({ partId: "", quantityUsed: 1 })}>
          <Plus strokeWidth={3} className="mr-2 h-4 w-4" /> Adicionar Peça
        </Button>
      </div>
    </div>
  );
}
