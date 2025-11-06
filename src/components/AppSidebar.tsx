"use client";

import {
  Car,
  Database,
  FileText,
  Home,
  Package,
  Users,
  IdCardLanyard,
  Wrench,
  BanknoteArrowDown,
  LayoutDashboard,
  PanelRightClose,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/auth.store";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

import logo from "../../public/logo.svg";
import logoWithoutText from "../../public/logo-2.svg";

const items = [
  {
    title: "Painel",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Clientes",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Funcionários",
    url: "/employees",
    icon: IdCardLanyard,
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
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent className="bg-accent">
        <div className={cn("flex items-center m-1", open ? "justify-between" : "justify-center")}>
          {open ? (
            <Image src={logo} alt="Reco.app" className="ml-2" height={80} width={80} />
          ) : (
            <Image src={logoWithoutText} alt="Reco.app" height={30} width={30} />
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupContent className={cn(open ? "mt-4" : "mt-8")}>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "text-muted-foreground h-8 py-5 hover:text-red-400 font-medium",
                          isActive && "bg-primary/5 text-blue-900 font-semibold"
                        )}
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
      <SidebarTrigger
        className={cn("absolute z-50 transition-all", open ? "right-4 top-8" : "right-0 top-8 bg-accent hover:bg-accent translate-x-1/2")}
      />
    </Sidebar>
  );
}
