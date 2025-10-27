"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TopUsedPartItem } from "@/types/dashboard"; // Importe o tipo correto
import { ArrowRight, Package } from "lucide-react";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/formatters";

interface TopUsedPartsCardProps {
  parts?: TopUsedPartItem[];
  totalAmount: number;
  isLoading?: boolean;
}

export function TopUsedPartsCard({ parts = [], totalAmount, isLoading = false }: TopUsedPartsCardProps) {
  const router = useRouter();

  const handleViewInventoryClick = () => {
    router.push("/inventory");
  };

  console.log(totalAmount);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between w-[100%]">
        <div>
          <CardTitle className="text-sm font-medium text-primary flex items-center">
            <Package className="mr-2 h-4 w-4" /> Peças mais utilizadas
          </CardTitle>
          <CardDescription>Mais utilizadas no período</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs py-2 px-3 h-auto text-primary hover:bg-accent"
          onClick={handleViewInventoryClick}
        >
          Ver todas <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3 pt-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-part-${index}`} className="flex justify-between items-center">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-4 w-1/5" />
              </div>
            ))}
          </div>
        ) : parts.length > 0 ? (
          <div className="space-y-3 pt-2">
            {parts.map((part, index) => (
              <React.Fragment key={part.partId}>
                <div className="flex justify-between items-center text-sm">
                  <div className="truncate text-muted-foreground w-[100%]">
                    <span className="mr-2 font-semibold border-r-2 border-muted-foreground/40 pr-2">
                      {index + 1}. {part.partName}
                    </span>
                    <span className="mr-2">cód.: {part.partCode.toUpperCase()}</span>
                  </div>
                  <p className="font-semibold text-primary flex items-center">
                    {part.totalQuantityUsed}
                    <span className="text-xs ml-1 text-muted-foreground font-normal">unid.</span>
                  </p>
                </div>
                <Progress className="[&>*]:bg-blue-500" value={(part.totalQuantityUsed / totalAmount) * 100} />
                {index < parts.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-10">Nenhuma peça utilizada registrada no período selecionado.</p>
        )}
      </CardContent>
    </Card>
  );
}
