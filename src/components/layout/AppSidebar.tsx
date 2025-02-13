import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
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
                      <SidebarMenuButton
                        className={`flex w-full items-center gap-4 ${isActive ? "hover:bg-none" : "hover:bg-violet-300"} transition-colors`}
                      >
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
                      </SidebarMenuButton>
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
              <SidebarMenuButton
                onClick={handleSignOut}
                className="w-full gap-2 text-red-500 transition-colors hover:bg-red-600"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};
