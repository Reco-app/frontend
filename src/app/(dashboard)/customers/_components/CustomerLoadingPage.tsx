"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarFold, Car, Contact, FileText, Mail, MapPin, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerLoadingPage() {
  return (
    <div className="container mx-auto max-w-6xl p-6 animate-pulse">
      {/* Cabeçalho da Página */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" disabled>
          <ArrowLeft className="h-8 w-8" />
        </Button>
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Contact className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Nome do cliente</p>
                  <Skeleton className="h-4 w-40 mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">N° Documento</p>
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">N° Telefone</p>
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Email</p>
                  <Skeleton className="h-4 w-48 mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="text-muted-foreground max-h-4 min-h-4 max-w-4 min-w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Endereço</p>
                  <Skeleton className="h-4 w-56 mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CalendarFold className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Cadastro</p>
                  <Skeleton className="h-4 w-44 mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between text-primary">
              <CardTitle className="flex items-center gap-2">
                <Car />
                <Skeleton className="h-5 w-48" />
              </CardTitle>
              <Skeleton className="h-9 w-36" />
            </CardHeader>
            <CardContent>
              <div className="md:grid-cols-2 grid grid-cols-1 gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Card key={i} className="bg-muted/30 py-2 shadow-none">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between">
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-5 w-12 rounded-full" />
                      </div>
                      <div className="space-y-2 text-sm">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between text-primary">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                <Skeleton className="h-5 w-56" />
              </CardTitle>
              <Skeleton className="h-9 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-md">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
