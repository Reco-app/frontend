"use client";

import { Button } from "@/components/ui/button";
import { RotateCw, Terminal } from "lucide-react";

interface ErrorPageInterface {
  title?: string;
  message?: string;
  onRetry: () => void;
}

export default function ErrorPage({
  title = "Erro ao buscar informações",
  message = "Houve um problema ao carregar os dados. Por favor, tente novamente.",
  onRetry,
}: ErrorPageInterface) {
  return (
    <main className="bg-background flex flex-col min-h-screen items-center justify-center p-4 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <div className="flex items-center space-x-4">
          <Terminal className="text-primary h-12 w-12" />
          <h1 className="text-primary text-7xl font-bold tracking-tighter">500</h1>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="text-muted-foreground my-4">{message}</p>
        </div>
        <Button onClick={onRetry}>
          <RotateCw className="mr-2 h-4 w-4" /> Tentar novamente
        </Button>
      </div>
    </main>
  );
}
