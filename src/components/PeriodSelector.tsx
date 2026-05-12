import { StatsPeriod } from "@/types/service-order";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface PeriodSelectorInterface {
  onSelectPeriod: (v: any) => void;
  style?: string;
  period?: StatsPeriod;
}

export function PeriodSelector({ period = StatsPeriod.WEEK, onSelectPeriod, style = "w-[100%] h-fit p-1" }: PeriodSelectorInterface) {
  return (
    <Tabs defaultValue={period} onValueChange={onSelectPeriod} className="items-end">
      <TabsList className={style}>
        <TabsTrigger className="text-xs h-6" value={StatsPeriod.WEEK}>
          Semana
        </TabsTrigger>
        <TabsTrigger className="text-xs h-6" value={StatsPeriod.MONTH}>
          Mês
        </TabsTrigger>
        <TabsTrigger className="text-xs h-6" value={StatsPeriod.ALL}>
          Todo o período
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
