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
      <div className="flex h-screen w-full">
        <AppSidebar />
        <DashboardSection>{children}</DashboardSection>
      </div>
    </SidebarProvider>
  );
}
