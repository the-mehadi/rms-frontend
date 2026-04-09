import {
  LayoutDashboardIcon,
  ReceiptTextIcon,
  CookingPotIcon,
  ShoppingCartIcon,
  NotebookPenIcon,
  LineChartIcon,
  SettingsIcon,
} from "lucide-react";

export const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/orders", label: "Orders", icon: ShoppingCartIcon },
      { href: "/kitchen", label: "Kitchen", icon: CookingPotIcon },
      { href: "/billing", label: "Billing", icon: ReceiptTextIcon },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/menu", label: "Menu", icon: NotebookPenIcon },
      { href: "/reports", label: "Reports", icon: LineChartIcon },
      { href: "/settings", label: "Settings", icon: SettingsIcon, disabled: true },
    ],
  },
];

export const MOBILE_TABS = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboardIcon },
  { href: "/orders", label: "Orders", icon: ShoppingCartIcon },
  { href: "/kitchen", label: "Kitchen", icon: CookingPotIcon },
  { href: "/billing", label: "Bill", icon: ReceiptTextIcon },
  { href: "/menu", label: "Menu", icon: NotebookPenIcon },
];

