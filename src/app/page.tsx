"use client"; // <--- Adicione isso no topo

import { useAuthStore } from "@/stores/auth.store";
import { redirect } from "next/navigation";
import { useLayoutEffect } from "react";

export default function Home() {
  const { user } = useAuthStore();

  useLayoutEffect(() => {
    redirect(user ? "/dashboard" : "/login");
  }, [user]);

  return null;
}
