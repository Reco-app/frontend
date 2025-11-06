"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RecentServiceOrderItem } from "@/types/dashboard";
import { ArrowRight, ScrollText } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { statusMap } from "@/lib/helpers";

interface RecentServiceOrdersCardProps {
  orders?: RecentServiceOrderItem[];
  isLoading?: boolean;
}

export function RecentServiceOrdersCard({ orders = [], isLoading = false }: RecentServiceOrdersCardProps) {
  const router = useRouter();

  const handleRowClick = (orderId: string) => {
    router.push(`/service-orders/${orderId}`);
  };

  const handleViewAllClick = () => {
    router.push("/service-orders");
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between w-[100%]">
        <div>
          <CardTitle className="text-sm font-medium text-primary flex items-center">
            <ScrollText className="mr-2 h-4 w-4" /> OS recentes
          </CardTitle>
          <CardDescription>Últimas 5 ordens de serviço</CardDescription>
        </div>
        <Button variant="ghost" size="sm" className="text-xs py-2 px-3 h-auto text-primary hover:bg-accent" onClick={handleViewAllClick}>
          Ver todas <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>OS#</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-10" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50 text-primary" onClick={() => handleRowClick(order.id)}>
                  <TableCell className="font-mono text-xs">{order.id.split("-")[0].toUpperCase()}</TableCell>
                  <TableCell>{order.vehicle}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(order.totalAmount ?? 0)}</TableCell>
                  <TableCell className="font-medium">{order.customer}</TableCell>
                  <TableCell>
                    <Badge variant={statusMap[order.status]?.variant || "outline"}>{statusMap[order.status]?.label || order.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt.toString())}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Nenhuma ordem de serviço recente encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
