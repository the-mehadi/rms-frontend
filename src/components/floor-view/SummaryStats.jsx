import { LayoutGrid, CheckCircle2, Circle, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SUMMARY_STAT_ITEMS } from "./floor-view-config";

const STAT_ICONS = {
  total_tables: LayoutGrid,
  available: CheckCircle2,
  occupied: Circle,
  ready_to_bill: Receipt,
};

export default function SummaryStats({ summary }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {SUMMARY_STAT_ITEMS.map((item) => {
        const Icon = STAT_ICONS[item.key];

        return (
          <Card
            key={item.key}
            className="rounded-xl border-0 bg-white py-0 shadow-md ring-0"
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full text-white",
                  item.iconClassName
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 md:text-4xl">
                  {summary?.[item.key] ?? 0}
                </div>
                <div className="text-xs font-medium tracking-wide text-gray-500">
                  {item.label}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
