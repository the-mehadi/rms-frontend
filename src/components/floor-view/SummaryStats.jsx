import { cn } from "@/lib/utils";
import { 
  TableIcon, 
  CheckCircle2Icon, 
  ClockIcon, 
  BanIcon, 
  ReceiptIcon 
} from "lucide-react";

const STAT_ITEMS = [
  { 
    id: 'total', 
    label: 'Total Tables', 
    icon: TableIcon, 
    color: 'bg-indigo-500/10 text-indigo-500' 
  },
  { 
    id: 'available', 
    label: 'Available', 
    icon: CheckCircle2Icon, 
    color: 'bg-emerald-500/10 text-emerald-500' 
  },
  { 
    id: 'occupied', 
    label: 'Occupied', 
    icon: ClockIcon, 
    color: 'bg-orange-500/10 text-orange-500' 
  },
  { 
    id: 'ready', 
    label: 'Ready to Bill', 
    icon: ReceiptIcon, 
    color: 'bg-rose-500/10 text-rose-500' 
  },
  { 
    id: 'reserved', 
    label: 'Reserved', 
    icon: BanIcon, 
    color: 'bg-gray-500/10 text-gray-500' 
  }
];

export default function SummaryStats({ summary }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {STAT_ITEMS.map((item) => (
        <div 
          key={item.id}
          className="glass lux-card flex items-center gap-3 p-4 transition-all hover:shadow-lux-sm"
        >
          <div className={cn("grid size-10 place-items-center rounded-2xl ring-1 ring-inset", item.color)}>
            <item.icon className="size-5" />
          </div>
          <div>
            <div className="text-xl font-bold tracking-tight tabular-nums">
              {item.id === 'total' ? (summary.total_tables || 0) : 
               item.id === 'ready' ? (summary.ready_to_bill || 0) : 
               (summary[item.id] || 0)}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
