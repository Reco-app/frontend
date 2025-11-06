import { VehiclesTable } from "./_components/VehiclesTable";

export default function VehiclesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="pb-8">
        <h1 className="text-2xl font-bold text-primary">Gerencimento de veículos</h1>
        <p className="text-muted-foreground">Cadastre e obtenha informações sobre os veículos</p>
      </div>

      <VehiclesTable />
    </div>
  );
}
