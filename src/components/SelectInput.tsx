// src/components/ui/SelectInput.tsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface SelectInputProps {
  options: {
    value: string;
    label: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  isSearchable?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SelectInput({
  options,
  value,
  onChange,
  isSearchable = true,
  placeholder = "Selecione uma opção",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhum resultado encontrado",
  disabled = false,
  className,
}: SelectInputProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between border-1 border-border hover:cursor-pointer h-10",
            "focus-visible:ring-secondary/70 focus-visible:ring-2",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            !value && "text-foreground",
            className,
          )}
        >
          <span className={`${value ? "text-foreground" : "text-muted-foreground"} font-normal pr-2`}>
            {value ? selectedLabel : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          {isSearchable && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            <CommandEmpty>
              <span className="text-gray-500">{emptyMessage}</span>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={index}
                  value={option.label}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className="pr-8"
                >
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
