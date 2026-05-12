"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarFold, Car, CarFront, FileText, IdCard, Phone, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function VehicleLoadingPage() {
  return (
    <div className="container mx-auto max-w-6xl p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" disabled>
          <ArrowLeft className="h-8 w-8" />
        </Button>
        <div>
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Car className="h-5 w-5 text-muted-foreground" />
                Informações do veículo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Nome do proprietário</p>
                  <Skeleton className="h-4 w-40 mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Telefone do proprietário</p>
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IdCard className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Placa</p>
                  <Skeleton className="h-4 w-24 mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CarFront className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Marca</p>
                  <Skeleton className="h-4 w-32 mt-1" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car className="text-muted-foreground max-h-4 min-h-4 max-w-4 min-w-4" />
                <div>
                  <p className="text-primary text-sm font-medium">Modelo</p>
                  <Skeleton className="h-4 w-48 mt-1" />
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

        <div className="lg:col-span-1">
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
