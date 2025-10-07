import { VehiclesTable } from "./_components/VehiclesTable";

export default function VehiclesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between w-[100%]">
        <h1 className="text-3xl font-bold mb-6">Gerenciamento de Veículos</h1>
      </div>

      <VehiclesTable />
    </div>
  );
}
