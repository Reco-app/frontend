"use client";

import * as React from "react";
import {
  CellContext,
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import TableActions from "@/components/TableActions";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  isLoading: boolean;
  filterColumnId: string;
  filterPlaceholder: string;
  createText: string;
  viewDetailsRoute?: string;
  FormComponent: React.ComponentType<{
    initialData?: TData | null;
    isPending: boolean;
    onSubmit: (values: any) => void;
  }>;
  onCreate?: () => void;
  onEdit?: (data: TData) => void;
  actions?: boolean;
  createMutation: { mutate: (data: any, options?: any) => void; isPending: boolean };
  updateMutation: { mutate: (data: any, options?: any) => void; isPending: boolean };
  deleteMutation?: { mutate: (id: string, options?: any) => void; isPending: boolean };
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  filterColumnId,
  filterPlaceholder,
  viewDetailsRoute,
  createText,
  FormComponent,
  createMutation,
  updateMutation,
  deleteMutation,
  onCreate,
  onEdit,
  actions = true,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState<TData | null>(null);

  const router = useRouter();

  const tableColumns = React.useMemo<ColumnDef<TData>[]>(
    () => [
      ...(actions
        ? [
            {
              id: "actions",
              cell: ({ row }: CellContext<TData, unknown>) => (
                <TableActions
                  onEdit={
                    onEdit
                      ? () => onEdit(row.original)
                      : () => {
                          setSelectedData(row.original);
                          setIsEditDialogOpen(true);
                        }
                  }
                  onDelete={
                    deleteMutation
                      ? () => {
                          setSelectedData(row.original);
                          setIsDeleteDialogOpen(true);
                        }
                      : undefined
                  }
                  onViewDetails={viewDetailsRoute ? () => router.push(`${viewDetailsRoute}/${(row.original as any).id}`) : undefined}
                />
              ),
            },
          ]
        : []),
      ...columns,
    ],
    [columns, viewDetailsRoute, router, onEdit, actions, deleteMutation]
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-[160px]" />
        </div>
        <div className="rounded-md border">
          <Skeleton className="h-[480px] w-full" />
        </div>
        <div className="flex items-center justify-end">
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center bg-input border-border border-2 rounded-md shadow-xs">
          <Search className="h-5 w-5 text-muted-foreground ml-4" />
          <Input
            placeholder={filterPlaceholder}
            value={(table.getColumn(filterColumnId)?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(filterColumnId)?.setFilterValue(event.target.value)}
            className="max-w-sm bg-transparent border-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <Button onClick={onCreate ? onCreate : () => setIsCreateDialogOpen(true)}>
          <Plus strokeWidth={3} className="mr-2 h-4 w-4" /> {createText}
        </Button>
      </div>

      <div className="rounded-md border shadow-sm">
        <Table className="rounded-md bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-gray-500 px-8 font-semibold">
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button variant="tableHeader" onClick={header.column.getToggleSortingHandler()} className="px-2 py-1 -ml-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}

                          {header.column.getIsSorted() === "asc" && <ArrowUp className="ml-2 h-4 w-4 text-secondary" />}
                          {header.column.getIsSorted() === "desc" && <ArrowDown className="ml-2 h-4 w-4 text-secondary" />}
                          {!header.column.getIsSorted() && <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />}
                        </Button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={(row.original as any).id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={viewDetailsRoute ? () => router.push(`${viewDetailsRoute}/${(row.original as any).id}`) : () => {}}
                  className="hover:cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => {
                    // Show actions column; all cells not empty and all cells with boolean value, even if false
                    return (
                      <TableCell className="px-8" key={cell.id}>
                        {cell.column.id.toLowerCase().includes("actions") ||
                        cell.getValue() ||
                        (!cell.getValue() && typeof cell.getValue() == "boolean") ? (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        ) : (
                          <span>N/A</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className="h-64 text-center text-gray-500">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="bg-white"
        >
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="bg-white">
          Próxima
        </Button>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader className="mb-2 text-primary">
            <DialogTitle>Cadastrar {createText.replace("Novo ", "")}</DialogTitle>
            <DialogDescription>Preencha os campos do formulário abaixo.</DialogDescription>
          </DialogHeader>
          <FormComponent
            isPending={createMutation.isPending}
            onSubmit={(values) => createMutation.mutate(values, { onSuccess: () => setIsCreateDialogOpen(false) })}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogOverlay />
        <DialogContent>
          <DialogHeader className="mb-2">
            <DialogTitle>Editar {createText.replace("Novo ", "")}</DialogTitle>
            <DialogDescription>Altere os campos desejados no formulário abaixo.</DialogDescription>
          </DialogHeader>
          <FormComponent
            initialData={selectedData}
            isPending={updateMutation.isPending}
            onSubmit={(values) => {
              updateMutation.mutate({ id: (selectedData as any)?.id, ...values }, { onSuccess: () => setIsEditDialogOpen(false) });
            }}
          />
        </DialogContent>
      </Dialog>

      {deleteMutation && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
              <AlertDialogDescription>Essa ação não pode ser desfeita. Isso irá remover o registro permanentemente.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => deleteMutation.mutate((selectedData as any)?.id, { onSuccess: () => setIsDeleteDialogOpen(false) })}
              >
                Sim, excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
