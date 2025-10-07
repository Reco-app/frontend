import { Eye, MoreHorizontal, SquarePen, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails?: () => void;
  children?: React.ReactNode;
}

export default function TableActions({ onEdit, onDelete, onViewDetails, children }: TableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="font-medium px-2 py-2 shadow-lg">
        {children}
        {onViewDetails && (
          <DropdownMenuItem onClick={onViewDetails} className="hover:bg-accent hover:cursor-pointer">
            <Eye /> Ver Detalhes
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={onEdit} className="hover:bg-accent hover:cursor-pointer">
          <SquarePen /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-600 hover:cursor-pointer hover:bg-red-500/20 hover:text-red-600" onClick={onDelete}>
          <Trash className="text-red-500" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
