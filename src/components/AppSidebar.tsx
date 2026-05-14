"use client";

import { Car, Package, Users, IdCardLanyard, Wrench, BanknoteArrowDown, LayoutDashboard } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";
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
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="floating" className="rounded-4xl">
      <SidebarContent className="bg-primary rounded-lg">
        <div className={cn("flex items-center m-1", open ? "justify-between" : "justify-center")}>
          {open ? (
            <Image src={logo} alt="Reco.app" className="ml-2 invert brightness-0" height={80} width={80} />
          ) : (
            <Image src={logoWithoutText} alt="Reco.app" className="invert brightness-0 mt-2" height={30} width={30} />
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
                        className={cn("text-muted-foreground h-8 py-5 font-medium", isActive && "bg-white/20 text-white font-semibold")}
                      >
                        <item.icon className="text-white/80" />
                        <span className="text-white/80 font-medium">{item.title}</span>
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
        className={cn("absolute z-50 transition-all text-white", open ? "right-4 top-8" : "right-2.5 top-13 bg-primary translate-x-1/2")}
      />
    </Sidebar>
  );
}
