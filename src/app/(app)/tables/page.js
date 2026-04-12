"use client";

import * as React from "react";
import { PageTransition } from "@/components/motion/PageTransition";
import { HoverLift } from "@/components/motion/HoverLift";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PlusIcon,
  MoreVerticalIcon,
  SearchIcon,
  PencilIcon,
  Trash2Icon,
  Loader2Icon,
  UsersIcon,
} from "lucide-react";
import { tablesAPI } from "@/lib/api/table";
import { toast } from "sonner";

const TABLE_STATUSES = ["available", "occupied", "reserved"];

const TABLE_STYLES = {
  available: {
    label: "Available",
    badge: "bg-emerald-500/12 text-emerald-800 dark:text-emerald-300",
    ring: "ring-emerald-400/25",
    bg: "bg-[radial-gradient(120px_120px_at_30%_20%,rgba(16,185,129,0.35)_0%,transparent_60%)]",
  },
  occupied: {
    label: "Occupied",
    badge: "bg-orange-500/12 text-orange-900 dark:text-orange-300",
    ring: "ring-orange-400/25",
    bg: "bg-[radial-gradient(120px_120px_at_30%_20%,rgba(255,107,53,0.35)_0%,transparent_60%)]",
  },
  reserved: {
    label: "Reserved",
    badge: "bg-indigo-500/12 text-indigo-900 dark:text-indigo-300",
    ring: "ring-indigo-400/25",
    bg: "bg-[radial-gradient(120px_120px_at_30%_20%,rgba(99,102,241,0.35)_0%,transparent_60%)]",
  },
};

function TableModal({ open, onOpenChange, mode, initial, onSuccess }) {
  const [tableNumber, setTableNumber] = React.useState(initial?.table_number ?? "");
  const [capacity, setCapacity] = React.useState(initial?.capacity ?? "");
  const [status, setStatus] = React.useState(initial?.status ?? "available");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setTableNumber(initial?.table_number ?? "");
    setCapacity(initial?.capacity ?? "");
    setStatus(initial?.status ?? "available");
  }, [open, initial]);

  const handleSubmit = async () => {
    if (!tableNumber || !capacity) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const data = {
        table_number: tableNumber,
        capacity: parseInt(capacity),
        status,
      };

      if (mode === "edit" && initial?.id) {
        await tablesAPI.update(initial.id, data);
        toast.success("Table updated successfully");
      } else {
        await tablesAPI.create(data);
        toast.success("Table created successfully");
      }

      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save table:", error);
      const errorMessage = error.response?.data?.message || "Failed to save table. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] rounded-4xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Table" : "Add New Table"}</DialogTitle>
        </DialogHeader>

        <div className="mt-2 space-y-5">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Table Number
            </div>
            <Input
              type="text"
              value={tableNumber}
              onChange={(e) => setTableNumber(e.target.value)}
              placeholder="e.g., T-1"
              className="h-11 rounded-2xl focus-lux"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Capacity
            </div>
            <Input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g., 4"
              className="h-11 rounded-2xl focus-lux"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-muted-foreground">
              Status
            </div>
            <div className="flex flex-wrap gap-2">
              {TABLE_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-semibold transition",
                    status === s
                      ? "bg-rms-gradient text-white border-transparent shadow-glow"
                      : "bg-background/40 hover:bg-muted"
                  )}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button 
              variant="ghost" 
              className="h-11 rounded-2xl" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="h-11 rounded-2xl bg-rms-gradient text-white shadow-glow"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading && <Loader2Icon className="mr-2 size-4 animate-spin" />}
              {loading ? "Saving..." : mode === "edit" ? "Update Table" : "Add Table"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function TablesPage() {
  const [tables, setTables] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState("add");
  const [selectedTable, setSelectedTable] = React.useState(null);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const response = await tablesAPI.getAll();
      if (response.success) {
        setTables(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch tables:", error);
      toast.error("Failed to load tables");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTables();
  }, []);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedTable(null);
    setModalOpen(true);
  };

  const handleEdit = (table) => {
    setModalMode("edit");
    setSelectedTable(table);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this table?")) return;
    
    try {
      await tablesAPI.delete(id);
      toast.success("Table deleted successfully");
      fetchTables();
    } catch (error) {
      console.error("Failed to delete table:", error);
      toast.error("Failed to delete table");
    }
  };

  const filteredTables = React.useMemo(() => {
    return tables.filter((t) => 
      String(t.table_number || "").toLowerCase().includes(query.toLowerCase())
    );
  }, [tables, query]);

  return (
    <PageTransition className="space-y-6">
      <div className="glass lux-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-sm font-semibold">Table Management</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Admin tools • manage layout • capacity
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tables…"
                className="h-11 w-full rounded-2xl pl-10 sm:w-[320px] focus-lux"
              />
            </div>

            <Button
              onClick={handleAdd}
              className="h-11 rounded-2xl bg-rms-gradient text-white shadow-glow"
            >
              <PlusIcon className="mr-2 size-4" />
              Add Table
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filteredTables.map((t) => {
              const meta = TABLE_STYLES[t.status] || TABLE_STYLES.available;
              return (
                <div
                  key={t.id}
                  className={cn(
                    "relative aspect-square w-full overflow-hidden rounded-3xl border bg-background/40 p-4 transition-all",
                    meta.ring,
                    "hover:shadow-lux-sm"
                  )}
                >
                  <div className={cn("absolute inset-0 opacity-80", meta.bg)} />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <Badge className={cn("rounded-full", meta.badge)}>
                        {meta.label}
                      </Badge>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 rounded-xl">
                            <MoreVerticalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl">
                          <DropdownMenuItem onClick={() => handleEdit(t)} className="rounded-xl">
                            <PencilIcon className="mr-2 size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(t.id)} 
                            className="rounded-xl text-rose-600 focus:text-rose-600"
                          >
                            <Trash2Icon className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="mt-auto">
                      <div className="text-4xl font-semibold tracking-tight tabular-nums">
                        {t.table_number}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        <UsersIcon className="size-3" />
                        Seats {t.capacity}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredTables.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No tables found matching your search.
              </div>
            )}
          </div>
        )}
      </div>

      <TableModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        initial={selectedTable}
        onSuccess={fetchTables}
      />
    </PageTransition>
  );
}