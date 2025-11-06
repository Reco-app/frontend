"use client";

import { Button } from "@/components/ui/button";
import { RotateCw, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <div className="flex items-center space-x-4">
          <Terminal className="text-primary h-16 w-16" />
          <h1 className="text-primary text-9xl font-bold tracking-tighter">500</h1>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Erro ao buscar informações</h2>
          <p className="text-muted-foreground my-4">Recarregue a página e tente novamente.</p>
        </div>
        <Button onClick={() => router.refresh()}>
          <RotateCw /> Tentar novamente
        </Button>
      </div>
    </main>
  );
}
