import { MoreHorizontal, SquarePen, Trash } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
}

export default function TableActions({ onEdit, onDelete, children }: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        {children}
        <DropdownMenuItem onClick={onEdit} className="hover:bg-accent hover:cursor-pointer">
          <SquarePen /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-600 hover:cursor-pointer hover:bg-red-500/20 hover:text-red-600"
          onClick={onDelete}
        >
          <Trash className="text-red-500" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
