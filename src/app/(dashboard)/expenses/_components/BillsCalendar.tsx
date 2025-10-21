"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BillStatus, CalendarBill } from "@/types/bill";
import { format, getDaysInMonth, startOfMonth, endOfMonth, getDay, addMonths, subMonths, isSameMonth, isToday, getDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { useBillCalendar } from "@/hooks/use-bills";

const statusStyles: Record<BillStatus, { label: string; className: string }> = {
  PENDING: { label: "Pendente", className: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-100" },
  PAID: { label: "Pago", className: "bg-secondary/10 text-secondary border-secondary" },
  OVERDUE: { label: "Vencido", className: "bg-red-100 text-red-800 border-red-300 hover:bg-red-100" },
};

export function BillsCalendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const { data: bills, isLoading, isError } = useBillCalendar(currentYear, currentMonth);

  const billsByDay = React.useMemo(() => {
    const grouped: { [day: number]: CalendarBill[] } = {};
    bills?.forEach((bill) => {
      const dayOfMonth = getDate(new Date(bill.dueDate));
      if (!grouped[dayOfMonth]) {
        grouped[dayOfMonth] = [];
      }
      grouped[dayOfMonth].push(bill);
    });
    return grouped;
  }, [bills]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const startingDayOfWeek = getDay(monthStart);

  const calendarDays = React.useMemo(() => {
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ key: `empty-start-${i}`, day: null, isCurrentMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ key: `day-${day}`, day, isCurrentMonth: true });
    }
    while (days.length % 7 !== 0) {
      days.push({ key: `empty-end-${days.length}`, day: null, isCurrentMonth: false });
    }
    return days;
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" size="sm" onClick={handleToday}>
            Hoje
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold capitalize">{format(currentDate, "MMMM yyyy", { locale: ptBR })}</h2>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-4 text-xs">
            {Object.entries(statusStyles).map(([status, { label, className }]) => (
              <div key={status} className="flex items-center gap-1">
                <span className={cn("h-3 w-3 rounded-full inline-block", className.split(" ")[0])}></span>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-7 border-t border-l">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="text-center font-medium text-xs text-muted-foreground p-2 border-b border-r bg-muted/30">
              {day}
            </div>
          ))}

          {calendarDays.map(({ key, day, isCurrentMonth }) => (
            <div
              key={key}
              className={cn(
                "h-32 border-b border-r p-1 relative overflow-hidden",
                !isCurrentMonth && "bg-muted/10 text-muted-foreground opacity-50"
              )}
            >
              {day !== null && (
                <>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isToday(new Date(currentYear, currentMonth - 1, day)) &&
                        "bg-primary text-primary-foreground rounded-full h-5 w-5 flex items-center justify-center"
                    )}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-1.5rem)]">
                    {isLoading ? (
                      <Skeleton className="h-4 w-full mt-1" />
                    ) : isError ? (
                      <span className="text-xs text-destructive">Erro</span>
                    ) : (
                      billsByDay[day]?.map((bill) => (
                        <Badge
                          key={bill.id}
                          variant="outline"
                          className={cn(
                            "w-full rounded-xs text-xs font-normal truncate block text-left px-2 py-0.5",
                            statusStyles[bill.calculatedStatus].className
                          )}
                          title={`${bill.description} - ${formatCurrency(bill.value)}`} // Tooltip
                        >
                          {bill.description}
                        </Badge>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
