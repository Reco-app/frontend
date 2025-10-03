'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Employee, EmployeeRole } from '@/types/employee';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/formatters';
import { toast } from 'sonner';
import { EmployeeForm } from './EmployeeForm';
import { EmployeesTableSkeleton } from './EmployeesTableSkeleton';
import TableActions from '@/components/TableActions';

const fetchEmployees = async (): Promise<Employee[]> => {
  const { data } = await api.get('/employees');
  return data;
};
const createEmployee = (employeeData: Omit<Employee, 'id'>) => api.post('/employees', employeeData);
const updateEmployee = ({ id, ...employeeData }: Partial<Employee>) => api.patch(`/employees/${id}`, employeeData);
const deleteEmployee = (id: string) => api.delete(`/employees/${id}`);

export function EmployeesTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);

  const queryClient = useQueryClient();

  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: fetchEmployees,
  });

  const createMutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário criado com sucesso.');
      setIsCreateDialogOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response.data.message ?? 'Não foi possível criar o funcionário.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário atualizado com sucesso.');
      setIsEditDialogOpen(false);
      setSelectedEmployee(null);
    },
    onError: (err: any) => {
      toast.error(err.response.data.message ?? 'Não foi possível atualizar o cliente.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast.success('Funcionário removido com sucesso.');
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
    },
    onError: (err: any) => {
      toast.error(err.response.data.message ?? 'Não foi possível remover o funcionário.');
    },
  });

  const columns: ColumnDef<Employee>[] = [
    { accessorKey: 'name', header: 'Nome Completo' },
    { accessorKey: 'documentId', header: 'CPF' },
    { accessorKey: 'phone', header: 'Telefone' },
    {
      accessorKey: 'role',
      header: 'Cargo',
      cell: ({ row }) => (row.getValue('role') === EmployeeRole.ATTENDANT ? 'Atendente' : 'Mecânico'),
    },
    {
      accessorKey: 'salary',
      header: 'Salário',
      cell: ({ row }) => formatCurrency(row.getValue('salary')),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <TableActions
            onEdit={() => {
              setSelectedEmployee(employee);
              setIsEditDialogOpen(true);
            }}
            onDelete={() => {
              setSelectedEmployee(employee);
              setIsDeleteDialogOpen(true);
            }}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: employees ?? [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
  });

  if (isLoading) return <EmployeesTableSkeleton />;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filtrar por nome..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Novo Funcionário
        </Button>
      </div>

      <div className="rounded-md border shadow-xs">
        <Table className="rounded-md bg-white">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-gray-500">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                  Nenhum funcionário encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Próximo
        </Button>
      </div>

      {/* Modal de Criação */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader className="mb-2">
            <DialogTitle>Cadastrar Novo Funcionário</DialogTitle>
            <DialogDescription>Preencha os campos do formulário abaixo.</DialogDescription>
          </DialogHeader>
          <EmployeeForm isPending={createMutation.isPending} onSubmit={(values) => createMutation.mutate(values)} />
        </DialogContent>
      </Dialog>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="mb-2">
          <DialogHeader>
            <DialogTitle>Editar Funcionário</DialogTitle>
            <DialogDescription>Altere os campos desejados no formulário abaixo.</DialogDescription>
          </DialogHeader>
          <EmployeeForm
            initialData={selectedEmployee}
            isPending={updateMutation.isPending}
            onSubmit={(values) => updateMutation.mutate({ id: selectedEmployee?.id, ...values })}
          />
        </DialogContent>
      </Dialog>

      {/* Modal de Exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação não pode ser desfeita.
              <strong className="text-destructive ml-1">Isso irá remover permanentemente</strong> o registro de
              <strong className="text-primary ml-1">{selectedEmployee?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(selectedEmployee!.id)}
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
