"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/stores/auth.store";
import api from "@/lib/api";

import { PresentationCarousel } from "@/components/PresentationCarousel";
import { toast } from "sonner";
import { AxiosError } from "axios";
import Spinner from "@/components/Spinner";
import logo from "../../../public/logo-2.svg";
import Image from "next/image";
import { FloatingInput } from "@/components/FloatingInput";

const formSchema = z.object({
  identifier: z.string().length(11, { message: "O CPF deve ter 11 dígitos." }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
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
      identifier: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) => {
      return api.post<LoginResponse>("/auth/login", data);
    },
    onSuccess: (response) => {
      toast.success("Login realizado com sucesso!");
      const token = response.data.access_token;
      setToken(token);

      const decodedToken = jwtDecode<JwtPayload>(token);
      setUser({
        id: decodedToken.sub,
        document_id: decodedToken.document_id,
        role: decodedToken.role,
        name: decodedToken.name,
      });

      router.push("/dashboard");
    },
    onError: (error: AxiosError) => {
      const errorData = error.response?.data as { message?: string; statusCode: number };

      const errorMessage =
        errorData.statusCode >= 500
          ? "Um erro aconteceu. Por favor, tente novamente."
          : errorData?.message || "CPF ou senha inválidos. Tente novamente.";
      toast.error(`${errorMessage}`);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <main className="flex h-screen items-center justify-center p-3">
      <div className="flex w-full h-full justify-between">
        <Card className="flex flex-1 h-full flex-col justify-center items-center border-none shadow-none px-2 rounded-xl">
          <div className="flex flex-col w-full max-w-md">
            <CardHeader className="flex flex-col items-center mb-6">
              <Image src={logo} alt="Recoapp" width={80} />
              <CardTitle className="text-2xl text-center text-primary mt-2">Faça o seu login</CardTitle>
              <CardDescription className="text-center">Insira suas credenciais para acessar o sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FloatingInput label="CPF" {...form.register("identifier")} error={form.formState.errors?.identifier} />
                  <FloatingInput label="Senha" type="password" {...form.register("password")} error={form.formState.errors?.password} />
                  {form.formState.errors.root && (
                    <p className="text-destructive text-sm font-medium">{form.formState.errors.root.message}</p>
                  )}
                  <div className="w-full text-right">
                    <Button className="p-0" variant="link" onClick={() => console.log("TODO: Reset password page")}>
                      <span className="text-primary text-sm font-medium">Esqueceu sua senha?</span>
                    </Button>
                  </div>
                  <Button type="submit" className="py-5 rounded-xl font-bold w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? <Spinner /> : "Entrar"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </div>
        </Card>

        <div className="flex w-[50%] h-full rounded-2xl items-center justify-center bg-primary">
          <PresentationCarousel />
        </div>
      </div>
    </main>
  );
}
