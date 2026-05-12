import React, { useState, useEffect } from "react";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image, { StaticImageData } from "next/image";

import serviceOrder from "../../public/serviceOrder.png";
import finance from "../../public/finances.png";
import employee from "../../public/team.png";
import stats from "../../public/stats.png";
import box from "../../public/inventory.png";

interface PresentationCarouselItemProps {
  image: StaticImageData | string;
  title: string;
  description: string;
}

export function PresentationCarouselItem({ image, title, description }: PresentationCarouselItemProps) {
  return (
    <CarouselItem className="flex flex-col items-center justify-center space-y-4 p-6 text-center">
      <Image src={image} alt={title} width={700} height={400} className="rounded-md" />
      <div className="text-white my-6">
        <h3 className="mb-4 text-xl font-semibold">{title}</h3>
        <p className="text-md opacity-80">{description}</p>
      </div>
    </CarouselItem>
  );
}

export function PresentationCarousel() {
  const items = [
    {
      image: serviceOrder,
      title: "Serviços",
      description: "Gerencie ordens de serviço do início ao fim com mais organização, agilidade e praticidade.",
    },
    {
      image: stats,
      title: "Estatísticas",
      description: "Visualize relatórios detalhados e acompanhe o desempenho da oficina em tempo real.",
    },
    {
      image: box,
      title: "Estoque",
      description: "Controle a entrada e saída de peças com precisão, evitando perdas e falta de insumos.",
    },
    {
      image: employee,
      title: "Pessoas",
      description: "Centralize informações de clientes e veículos e organize sua equipe em um só lugar.",
    },
    {
      image: finance,
      title: "Financeiro",
      description: "Monitore receitas, pagamentos e despesas mantendo as finanças sempre sob controle.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    setActiveIndex(api.selectedScrollSnap());

    const handleSelect = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="relative flex h-full flex-col w-[700px] items-center justify-center">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={index}>
              <PresentationCarouselItem {...item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          variant="ghost"
          className="top-2/5 left-2 -translate-y-1/2 text-white opacity-70 transition-all hover:bg-white/80 hover:opacity-100"
        />
        <CarouselNext
          variant="ghost"
          className="top-2/5 right-2 -translate-y-1/2 text-white opacity-70 transition-all hover:bg-white/80 hover:opacity-100"
        />
      </Carousel>

      <div className="mt-4 flex gap-2">
        {items.map((_, index) => (
          <span
            key={index}
            className={`h-1 w-1 rounded-full transition-all duration-300 ${activeIndex === index ? "w-2 bg-white" : "bg-white/50"}`}
          />
        ))}
      </div>
    </div>
  );
}
