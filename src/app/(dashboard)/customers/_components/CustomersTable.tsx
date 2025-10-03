"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CustomerForm } from "./CustomerForm";
import api from "@/lib/api";
import { toast } from "sonner";
import { Customer } from "@/types/customer";
import { CustomersTableSkeleton } from "./CustomersTableSkeleton";
import TableActions from "@/components/TableActions";

const fetchCustomers = async (): Promise<Customer[]> => {
  const { data } = await api.get("/customers");
  return data.map((c: Customer) => ({ ...c, vehicles: c.vehicles || [] }));
};

const createCustomer = (customerData: Omit<Customer, "id">) => api.post("/customers", customerData);
const updateCustomer = ({ id, ...customerData }: Partial<Customer>) => api.patch(`/customers/${id}`, customerData);
const deleteCustomer = (id: string) => api.delete(`/customers/${id}`);

export function CustomersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);

  const queryClient = useQueryClient();
  const router = useRouter();

  const {
    data: customers,
    isLoading,
    isError,
  } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: fetchCustomers,
  });

  const createMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente criado com sucesso.");
      setIsCreateDialogOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response.data.message ?? "Não foi possível criar o cliente.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente atualizado com sucesso.");
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
    },
    onError: (err: any) => {
      toast.error(err.response.data.message ?? "Não foi possível atualizar o cliente.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Cliente removido com sucesso.");
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
    },
    onError: (err: any) => {
      toast.error(err.response.data.message ?? "Não foi possível excluir o cliente.");
    },
  });

  // --- Definição das Colunas ---

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Nome",
      cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "documentId",
      header: "CPF/CNPJ",
    },
    {
      accessorKey: "phone",
      header: "Telefone",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const customer = row.original;
        const hasVehicles = customer.vehicles && customer.vehicles.length > 0;

        return (
          <TableActions
            onEdit={() => {
              setSelectedCustomer(customer);
              setIsEditDialogOpen(true);
            }}
            onDelete={() => {
              setSelectedCustomer(customer);
              setIsDeleteDialogOpen(true);
            }}
          >
            <DropdownMenuItem
              onClick={() => router.push(`/customers/${customer.id}`)}
              className="text-primary hover:bg-accent hover:cursor-pointer"
            >
              <Eye />
              Ver Detalhes e Veículos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </TableActions>
        );
      },
    },
  ];

  const table = useReactTable({
    data: customers ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) return <CustomersTableSkeleton />;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm bg-white"
        />
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus strokeWidth={3} className="mr-2 h-4 w-4" /> Novo Cliente
        </Button>
      </div>

      <div className="rounded-md border shadow-xs">
        <Table className="rounded-md bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-gray-500 ">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
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
      </div>

      {/* Modal de Criação */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader className="mb-2">
            <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            <DialogDescription>Preencha os campos do formulário abaixo.</DialogDescription>
          </DialogHeader>
          <CustomerForm isPending={createMutation.isPending} onSubmit={(values) => createMutation.mutate(values)} />
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader className="mb-2">
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>Altere os campos desejados no formulário abaixo.</DialogDescription>
          </DialogHeader>
          <CustomerForm
            initialData={selectedCustomer}
            isPending={updateMutation.isPending}
            onSubmit={(values) => updateMutation.mutate({ id: selectedCustomer?.id, ...values })}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita. Isso irá remover permanentemente o cliente <strong>{selectedCustomer?.name}</strong> do
              sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(selectedCustomer!.id)}
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
