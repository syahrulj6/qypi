import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardSection } from "./DashboardSection";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />

        <div className="flex-1 p-6">
          <DashboardSection>{children}</DashboardSection>
        </div>
      </div>
    </SidebarProvider>
  );
}
