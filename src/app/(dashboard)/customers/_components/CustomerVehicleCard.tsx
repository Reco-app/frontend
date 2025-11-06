import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Vehicle } from "@/types/vehicle";

interface CustomerVehicleCard {
  vehicle: Vehicle;
}

export function CustomerVehicleCard({ vehicle }: CustomerVehicleCard) {
  return (
    <Card key={vehicle.id} className="bg-muted/30 py-2 shadow-none">
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <h4 className="text-primary font-bold text-sm flex flex-col">
            <span className="text-primary/60">{vehicle.carBrand}</span>
            <span>{vehicle.carModel}</span>
          </h4>
          <Badge variant="outline" className="text-primary">
            {vehicle.year}
          </Badge>
        </div>
        <div className="text-muted-foreground space-y-1 text-sm">
          <p>
            <span className="font-semibold">Placa:</span> {vehicle.plate}
          </p>
          <p>
            <span className="font-semibold">Cor:</span> {vehicle.color || "Não informada."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
