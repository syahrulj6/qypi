import { useState } from "react";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardSection } from "./DashboardSection";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Calendar, Home, Inbox, Menu, Search, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Inbox", url: "/dashboard/inbox", icon: Inbox },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <aside className="hidden md:flex md:w-64">
          <AppSidebar />
        </aside>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="absolute left-4 top-4 z-50 block md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="px-4 py-16">
            <div className="flex h-full w-full flex-col justify-between">
              <div className="flex flex-col gap-3">
                {menuItems.map(({ title, url, icon: Icon }, index) => {
                  const isActive = pathname === url;
                  return (
                    <Link href={url}>
                      <button
                        className={`flex w-full items-center gap-4 ${isActive ? "hover:bg-none" : "hover:bg-violet-300"} rounded-md p-2 transition-colors`}
                      >
                        {" "}
                        <Icon
                          className={`h-5 w-5 transition-colors ${
                            isActive ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={
                            isActive ? "text-primary" : "text-muted-foreground"
                          }
                        >
                          {title}
                        </span>
                      </button>
                    </Link>
                  );
                })}
                <div className="flex items-center gap-2"></div>
              </div>
              <div className=""></div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 flex-col">
          <DashboardSection>{children}</DashboardSection>
        </div>
      </div>
    </SidebarProvider>
  );
}
