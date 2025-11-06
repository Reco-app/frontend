import { StatsPeriod } from "@/types/service-order";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface PeriodSelectorInterface {
  onSelectPeriod: (v: any) => void;
  width?: string;
}

export function PeriodSelector({ onSelectPeriod, width = "100%" }: PeriodSelectorInterface) {
  return (
    <Tabs defaultValue={StatsPeriod.WEEK} onValueChange={onSelectPeriod} className="items-end">
      <TabsList className={`w-[${width}] h-8`}>
        <TabsTrigger className="text-xs h-[100%]" value={StatsPeriod.WEEK}>
          Esta Semana
        </TabsTrigger>
        <TabsTrigger className="text-xs h-[100%]" value={StatsPeriod.MONTH}>
          Este Mês
        </TabsTrigger>
        <TabsTrigger className="text-xs h-[100%]" value={StatsPeriod.ALL}>
          Todo Período
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
