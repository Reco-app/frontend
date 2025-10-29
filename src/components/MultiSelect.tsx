"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Command, CommandInput } from "@/components/ui/command"; // Note: NÃO importamos mais CommandList, CommandItem, etc.
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useVirtualizer } from "@tanstack/react-virtual";

interface MultiSelectProps {
  options?: { label: string; value: string }[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

function MultiSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select items...",
  className,
  isLoading = false,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const parentRef = React.useRef<HTMLDivElement>(null);

  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    return options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  const rowVirtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32,
    overscan: 5,
  });

  const handleUnselect = (item: string) => {
    onChange(value.filter((i) => i !== item));
  };

  const handleSelect = (item: string) => {
    if (value.includes(item)) {
      handleUnselect(item);
    } else {
      onChange([...value, item]);
    }
  };

  const virtualItems = rowVirtualizer.getVirtualItems();

  return (
    <div className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            "flex h-12 px-2 w-full shadow-xs transition-all items-center justify-between rounded-md border border-input bg-input text-sm",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50 outline-0"
          )}
          disabled={disabled || isLoading}
          aria-expanded={open}
        >
          <div className="flex justify-between flex-1 overflow-hidden">
            <div
              className="flex gap-1 flex-1 py-2 px-3 overflow-x-hidden max-w-[100%] max-h-12 overflow-y-scroll flex-wrap"
              style={{ scrollbarWidth: "none" }}
            >
              {value.length === 0 ? (
                <span className="text-muted-foreground truncate">{placeholder}</span>
              ) : (
                <p className="text-primary">
                  <span className="font-bold text-secondary">{value.length}</span> veículo(s) adicionado(s)
                </p>
              )}
            </div>
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
              tabIndex={0}
              className={cn(
                "p-1 mx-1.5 my-auto h-full outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "hover:bg-accent/50 rounded-sm cursor-pointer"
              )}
            >
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </span>
          </div>
        </PopoverTrigger>
        <PopoverContent className="min-w-md p-0" align="start">
          <Command>
            <CommandInput value={search} onValueChange={setSearch} placeholder="Buscar..." />
          </Command>
          <div ref={parentRef} style={{ height: "200px", overflow: "auto" }} className="p-1">
            {isLoading ? (
              <div className="p-2 space-y-1">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-4 w-full" />
                ))}
              </div>
            ) : filteredOptions.length > 0 ? (
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualItems.map((virtualItem) => {
                  const option = filteredOptions[virtualItem.index];
                  return (
                    <div
                      key={option.value}
                      role="option"
                      aria-selected={value.includes(option.value)}
                      onClick={() => handleSelect(option.value)}
                      className="flex items-center p-2 text-sm cursor-pointer rounded-sm hover:bg-accent"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", value.includes(option.value) ? "opacity-100" : "opacity-0")} />
                      {option.label}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-sm py-4 text-muted-foreground">Nenhum item encontrado.</div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default React.memo(MultiSelect);
