import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <div className="flex max-w-md flex-col items-center space-y-6">
        <div className="flex items-center space-x-4">
          <Terminal className="text-primary h-16 w-16" />
          <h1 className="text-primary text-9xl font-bold tracking-tighter">404</h1>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Página Não Encontrada</h2>
          <p className="text-muted-foreground my-8">
            Oops! Parece que o endereço que você tentou acessar não existe ou foi movido.
          </p>
        </div>
        <Button asChild>
          <Link href="/">Voltar para a Página Inicial</Link>
        </Button>
      </div>
    </main>
  );
}
