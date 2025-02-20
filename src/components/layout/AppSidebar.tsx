import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
} from "~/components/ui/sidebar";
import {
  LayoutDashboard,
  Inbox,
  Calendar,
  Search,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "~/hooks/useSession";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Inbox", url: "/dashboard/inbox", icon: Inbox },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export const AppSidebar = () => {
  const { session, handleSignOut } = useSession();
  const pathname = usePathname();

  return (
    <Sidebar className="flex h-screen w-56 flex-col">
      <SidebarHeader
        aria-hidden
        className="ml-1 mt-3 text-2xl font-bold text-primary hover:cursor-pointer"
      >
        <Link href={"/"}>Qypi</Link>
      </SidebarHeader>
      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-2 flex flex-col gap-4">
              {menuItems.map(({ title, url, icon: Icon }, index) => {
                const isActive = pathname === url;
                return (
                  <SidebarMenuItem key={index}>
                    <Link href={url}>
                      <Button
                        variant="ghost"
                        className={`flex w-full items-center justify-start gap-4 ${isActive ? "bg-primary hover:bg-primary" : "hover:bg-primary"} transition-colors`}
                      >
                        <Icon
                          className={`h-5 w-5 transition-colors ${
                            isActive ? "text-white" : "text-muted-foreground"
                          }`}
                        />
                        <span
                          className={
                            isActive ? "text-white" : "text-muted-foreground"
                          }
                        >
                          {title}
                        </span>
                      </Button>
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {session && (
        <SidebarFooter className="mb-4 mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <Button
                onClick={handleSignOut}
                variant={"destructive"}
                className="flex w-full justify-start gap-4"
              >
                <LogOut className="h-5 w-5" />
                <p>Logout</p>
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};
