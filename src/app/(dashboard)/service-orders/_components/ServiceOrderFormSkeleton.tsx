"use client";

import * as React from "react";
import { CreditCard, FileUser, Wrench } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function ServiceOrderFormSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <Card>
        <CardHeader>
          <div className="flex items-center text-primary">
            <FileUser className="mr-2 h-5 w-5" />
            <CardTitle>Informações Gerais</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-baseline">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-baseline">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            <div className="flex items-center text-primary">
              <Wrench className="mr-2 h-5 w-5" />
              <span className="text-md">Serviços Executados</span>
            </div>
          </CardTitle>
          <Skeleton className="h-9 w-36" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg relative bg-muted/20 space-y-4">
            <Skeleton className="h-7 w-7 absolute top-2 right-2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <Skeleton className="h-5 w-36" />
              <div className="grid gap-2 grid-cols-10 items-start">
                <Skeleton className="h-10 col-span-8" />
                <Skeleton className="h-10 col-span-1" />
                <Skeleton className="h-10 col-span-1" />
              </div>
              <Skeleton className="h-9 w-36" />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4 pr-6 border-r-2">
              <div className="flex items-center justify-between">
                <div className="flex text-primary">
                  <CreditCard className="mr-2 h-5 w-5" />
                  <h3 className="font-semibold">Pagamentos</h3>
                </div>
                <Skeleton className="h-9 w-44" />
              </div>
              <div className="grid grid-cols-9 gap-2 items-start p-3 border rounded-lg bg-muted/30">
                <div className="col-span-3 space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="col-span-1 col-start-9 flex flex-col items-center justify-end flex-1">
                  <Skeleton className="h-4 w-10 mb-2" />
                  <Skeleton className="h-10 w-10" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground text-center py-16">Carregando pagamentos...</p>
            </div>
            <div className="space-y-4 bg-muted/30 p-8 rounded-md border">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Separator />
              <div className="space-y-3 text-right">
                <div className="flex justify-between items-center text-sm">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <Separator />
                <div className="flex justify-between items-center text-sm">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between items-center text-md font-bold">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-44" />
      </div>
    </div>
  );
}
