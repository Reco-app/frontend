"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface DetailsHeaderInterface {
  title: string;
  description: string;
}

export function DetailsHeader({ title, description }: DetailsHeaderInterface) {
  const router = useRouter();
  return (
    <div className="flex items-center gap-4 mb-8">
      <Button variant="ghost" size="icon" onClick={() => router.back()}>
        <ArrowLeft className="h-8 w-8" />
      </Button>
      <div>
        <h1 className="text-primary mb-1 text-xl font-bold">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
