import { LayoutGrid } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TableCard from "./TableCard";

export default function TableGrid({
  tables,
  loading,
  getDisplayStatus,
  onTableClick,
  onBillingClick,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4 md:grid-cols-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="h-[200px] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!tables || tables.length === 0) {
    return (
      <div className="py-12 text-center">
        <LayoutGrid className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900">No tables found</h3>
        <p className="mt-2 text-sm text-gray-500">Add tables to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {tables.map((table) => (
        <TableCard
          key={table.id}
          table={table}
          displayStatus={getDisplayStatus(table)}
          onClick={onTableClick}
          onBillingClick={onBillingClick}
        />
      ))}
    </div>
  );
}
