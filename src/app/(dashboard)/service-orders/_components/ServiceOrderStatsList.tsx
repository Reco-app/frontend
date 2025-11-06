import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { capitalize } from "@/lib/formatters";

export function ServiceOrderStatsList({ title, data, isLoading, icon }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-md text-primary">{title}</span>
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3 pt-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={`skeleton-part-${index}`} className="flex justify-between items-center">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-4 w-1/5" />
              </div>
            ))}
          </div>
        )}

        {data && data.length === 0 && <p className="text-sm text-muted-foreground">Nenhum dado no período.</p>}
        {data && data.length > 0 && (
          <ul className="space-y-2.5 text-muted-foreground -mt-1">
            {data.map((item: any) => (
              <li key={item.serviceName || item.vehicleName} className="flex items-center justify-between">
                <span className="text-sm font-medium">{capitalize(item.serviceName ?? "") || item.vehicleName}</span>
                <span className="text-sm font-bold">{item.count}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
