import { VehiclesTable } from "./_components/VehiclesTable";

export default function VehiclesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between w-[100%]">
        <h1 className="text-primary mb-4 text-2xl font-bold">Gerenciamento de Veículos</h1>
      </div>

      <VehiclesTable />
    </div>
  );
}
