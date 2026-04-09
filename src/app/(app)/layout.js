import { SidebarNav } from "@/components/app/SidebarNav";
import { TopHeader } from "@/components/app/TopHeader";
import { MobileNav } from "@/components/app/MobileNav";

export default function AppLayout({ children }) {
  return (
    <div className="min-h-dvh">
      <SidebarNav />
      <TopHeader />

      <main className="px-3 pb-28 lg:ml-[280px] lg:px-6 lg:pb-10">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}

