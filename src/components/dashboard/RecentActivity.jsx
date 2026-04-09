"use client";

import { Badge } from "@/components/ui/badge";
import { StaggerItem, StaggerList } from "@/components/motion/StaggerList";
import {
  CheckCircle2Icon,
  InfoIcon,
  TriangleAlertIcon,
  ClockIcon,
} from "lucide-react";

const STATUS = {
  success: {
    icon: CheckCircle2Icon,
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  info: {
    icon: InfoIcon,
    badge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  warning: {
    icon: TriangleAlertIcon,
    badge: "bg-amber-500/10 text-amber-800 dark:text-amber-300",
  },
  neutral: {
    icon: ClockIcon,
    badge: "bg-muted text-foreground",
  },
};

export function RecentActivity({ items }) {
  return (
    <div className="glass lux-card p-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold">Recent activity</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Timeline • smooth stagger
          </div>
        </div>
        <Badge className="rounded-full bg-muted text-muted-foreground">
          Live
        </Badge>
      </div>

      <div className="mt-6">
        <StaggerList className="space-y-4">
          {items.map((a, idx) => {
            const meta = STATUS[a.status] ?? STATUS.neutral;
            const Icon = meta.icon;
            return (
              <StaggerItem key={a.id}>
                <div className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="grid size-9 place-items-center rounded-2xl bg-background ring-1 ring-border">
                      <Icon className="size-4 text-muted-foreground" />
                    </div>
                    {idx !== items.length - 1 ? (
                      <div className="mt-2 h-full w-px bg-border" />
                    ) : null}
                  </div>

                  <div className="flex-1 rounded-2xl border bg-background/50 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-sm font-medium">{a.title}</div>
                      <Badge className={`rounded-full ${meta.badge}`}>
                        {a.time}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Tap to view details • infinite scroll placeholder
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerList>
      </div>
    </div>
  );
}

