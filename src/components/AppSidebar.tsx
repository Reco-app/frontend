"use client";

import {
  Car,
  Database,
  FileText,
  Home,
  Package,
  Settings,
  Users,
  IdCardLanyard,
  Wrench,
  User2,
  ChevronUp,
  LogOut,
  BanknoteArrowDown,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { useAuthStore } from "@/stores/auth.store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const items = [
  {
    title: "Painel",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Funcionários",
    url: "/employees",
    icon: IdCardLanyard,
  },
  {
    title: "Clientes",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Veículos",
    url: "/vehicles",
    icon: Car,
  },
  {
    title: "Estoque",
    url: "/inventory",
    icon: Package,
  },
  {
    title: "Ordens de Serviço",
    url: "/service-orders",
    icon: Wrench,
  },
  {
    title: "Despesas",
    url: "/expenses",
    icon: BanknoteArrowDown,
  },
  {
    title: "Financeiro",
    url: "/finance",
    icon: FileText,
  },
  {
    title: "Backup",
    url: "/backup",
    icon: Database,
  },
];

export function AppSidebar() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarContent className="bg-primary">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-white">Reco.app</SidebarGroupLabel>
          <Separator className="bg-white/20" />
          <SidebarGroupContent className="mt-4">
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn("font-semibold text-white hover:bg-white/10 h-10 hover:text-white py-4", isActive && "bg-white/20")}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-primary">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="text-white">
                  <User2 /> {user?.name}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem className="hover:bg-destructive/10 text-destructive">
                  <LogOut color="red" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
