import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCardProps {
  title: string;
  value: number | string;
  secondaryValue?: string;
  description?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  valueClass?: string;
}

export function StatCard({ title, value, secondaryValue, description, icon, isLoading, valueClass }: StatCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4 mb-1" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="text-primary">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold flex items-end", valueClass)}>
          {value}
          {secondaryValue && <span className="text-muted-foreground text-sm font-medium ml-4">{secondaryValue}</span>}
        </div>
        {description && <p className="text-xs mt-1 text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}
