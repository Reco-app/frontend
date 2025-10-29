"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";

export interface FinanceTableColumn<TData> {
  header: string;
  accessorKey?: keyof TData;
  cell?: (item: TData) => React.ReactNode;
  className?: string;
}

interface DashboardTableProps<TData extends { id: string }> {
  title: string;
  description?: string;
  columns: FinanceTableColumn<TData>[];
  data: TData[];
  isLoading?: boolean;
  itemsPerPage?: number;
  onRowClick?: (item: TData) => void;
  noDataMessage?: string;
}

export function FinanceTable<TData extends { id: string }>({
  title,
  description,
  columns,
  data = [],
  isLoading = false,
  itemsPerPage = 5,
  onRowClick,
  noDataMessage = "Nenhum item encontrado.",
}: DashboardTableProps<TData>) {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.header} className={cn("font-semibold", col.className)}>
                    {col.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center">
                    <Spinner />
                  </TableCell>
                </TableRow>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow
                    key={item.id}
                    className={cn(onRowClick && "cursor-pointer hover:bg-muted/50")}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                  >
                    {columns.map((col) => (
                      <TableCell key={`${item.id}-${col.header}`} className={col.className}>
                        {col.cell ? col.cell(item) : col.accessorKey ? (item as any)[col.accessorKey] : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center text-muted-foreground">
                    {noDataMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 pt-4">
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
              Próxima
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
