"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface MonetaryInputProps extends React.ComponentProps<"input"> {}

const MonetaryInput = React.forwardRef<HTMLInputElement, MonetaryInputProps>(({ className, type, ...props }, ref) => {
  return (
    <div className={cn("relative w-full", className)}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>

      <Input type={type} className={cn("pl-9")} ref={ref} {...props} />
    </div>
  );
});
MonetaryInput.displayName = "MonetaryInput";

export { MonetaryInput };
