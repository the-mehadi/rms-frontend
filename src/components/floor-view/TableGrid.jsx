import TableCard from "./TableCard";
import { Loader2Icon } from "lucide-react";

export default function TableGrid({ tables, loading, onTableClick }) {
  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center rounded-3xl border bg-background/40">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="size-10 animate-spin text-rms-gradient" />
          <div className="text-sm font-semibold text-muted-foreground">
            Mapping your floor...
          </div>
        </div>
      </div>
    );
  }

  if (!tables || tables.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-3xl border bg-background/40">
        <div className="text-sm font-semibold text-muted-foreground">
          No tables found on your floor.
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {tables.map((table) => (
        <TableCard 
          key={table.id} 
          table={table} 
          onClick={onTableClick}
        />
      ))}
    </div>
  );
}
