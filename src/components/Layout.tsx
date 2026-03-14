import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DemoBanner } from "@/components/DemoBanner";
import { isDemoModeActive } from "@/hooks/useDemoMode";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isDemo = isDemoModeActive();
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        {isDemo && <DemoBanner />}
        <div className="flex flex-1">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <header className="h-14 border-b border-border bg-card flex items-center px-4">
              <SidebarTrigger />
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
