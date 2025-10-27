"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, TooltipProps } from "recharts";
import { formatCurrency } from "@/lib/formatters";
import { RevenueExpenseChartDataItem } from "@/types/dashboard";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

interface RevenueExpenseChartProps {
  data: RevenueExpenseChartDataItem[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  const formatTooltip = (value: number) => formatCurrency(value);
  const revenueColor = "#22c55e";
  const expenseColor = "#ef4444";

  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-3 shadow-sm">
        <p className="text-sm font-medium">{label} </p>
        <div className="mt-2 space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <span
                  className="mr-2 h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.name === "Receitas" ? revenueColor : expenseColor }}
                />
                <span className="text-muted-foreground">{entry.name}:</span>
              </div>
              <span className="ml-4 font-semibold">{formatTooltip(entry.value as number)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export function RevenueExpenseChart({ data }: RevenueExpenseChartProps) {
  const formatYAxis = (tickItem: number) => formatCurrency(tickItem);
  const revenueColor = "#22c55e";
  const expenseColor = "#ef4444";

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxis} width={60} />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(200, 200, 200, 0.1)" }} />

        <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: "12px", fontWeight: "bold" }} />
        <Bar dataKey="revenue" name="Receitas" fill={revenueColor} radius={[6, 6, 0, 0]} />
        <Bar dataKey="expense" name="Despesas" fill={expenseColor} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
