'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';

import { PresentationCarousel } from '@/components/PresentationCarousel';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

const formSchema = z.object({
  document_id: z.string().length(11, { message: 'O CPF deve ter 11 dígitos.' }),
  password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres.' }),
});

interface LoginResponse {
  access_token: string;
}

interface JwtPayload {
  sub: string;
  document_id: string;
  role: string;
  name: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document_id: '',
      password: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return api.post<LoginResponse>('/auth/login', data);
    },
    onSuccess: (response) => {
      toast.success('Login realizado com sucesso!');
      const token = response.data.access_token;
      setToken(token);

      const decodedToken = jwtDecode<JwtPayload>(token);
      setUser({
        id: decodedToken.sub,
        document_id: decodedToken.document_id,
        role: decodedToken.role,
        name: decodedToken.name,
      });

      router.push('/dashboard');
    },
    onError: (error: AxiosError) => {
      const errorData = error.response?.data as { message?: string; statusCode: number };

      const errorMessage =
        errorData.statusCode >= 500
          ? 'Um erro aconteceu. Por favor, tente novamente.'
          : errorData?.message || 'CPF ou senha inválidos. Tente novamente.';
      toast.error(`${errorMessage}`);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="flex h-[480px] w-full max-w-3xl rounded-xl shadow-2xl">
        <div className="bg-primary flex w-1/2 items-center justify-center rounded-l-xl">
          <PresentationCarousel />
        </div>
        <Card className="flex w-1/2 flex-col justify-center rounded-none rounded-r-xl border-0 px-2">
          <CardHeader>
            <CardTitle className="text-2xl">Bem vindo!</CardTitle>
            <CardDescription>Insira suas credenciais para acessar o sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="document_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="Insira seu CPF" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Insira sua senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.formState.errors.root && (
                  <p className="text-destructive text-sm font-medium">{form.formState.errors.root.message}</p>
                )}
                <Button type="submit" className="w-full" disabled={mutation.isPending}>
                  {mutation.isPending ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
