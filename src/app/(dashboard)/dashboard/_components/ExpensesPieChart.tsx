"use client";

import * as React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, TooltipProps } from "recharts";
import { ExpensesByCategoryItem } from "@/types/dashboard";
import { formatCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#ff4d4d", "#4ddbff", "#ffcc00"];

interface ExpensesPieChartProps {
  data: ExpensesByCategoryItem[];
  isLoading?: boolean;
}

export function ExpensesPieChart({ data, isLoading }: ExpensesPieChartProps) {
  const totalExpenses = React.useMemo(() => data.reduce((sum, item) => sum + item.total, 0), [data]);

  if (data.length === 0) return <span className="text-sm">Nenhuma despesa cadastrada no período</span>;

  if (isLoading) return <Skeleton className="h-60 w-full rounded-full" />;

  const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const dataEntry = payload[0];
      const value = dataEntry.value as number;
      const name = dataEntry.name;
      const color = dataEntry.color || dataEntry.fill;

      const percentage = totalExpenses > 0 ? ((value / totalExpenses) * 100).toFixed(1) : 0;

      return (
        <div className={`rounded-lg border p-3 shadow-sm bg-background`}>
          <div className="flex items-center">
            <span className="mr-2 h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-medium">{name}</span>
          </div>
          <p className="mt-1 ml-4 text-sm text-muted-foreground">
            {formatCurrency(value)} ({percentage}%)
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={50}
          paddingAngle={2}
          cornerRadius={8}
          fill="#8884d8"
          dataKey="total"
          nameKey="category"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip content={<CustomTooltip />} />

        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          iconSize={10}
          wrapperStyle={{ fontSize: "12px", lineHeight: "1.5" }}
          formatter={(value: any, entry: any) => {
            const { color } = entry;
            const item = data.find((d) => d.category === value);
            return <span style={{ color, fontWeight: "bold" }}>{value}</span>;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
