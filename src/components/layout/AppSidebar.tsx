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
import { Home, Inbox, Calendar, Search, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession } from "~/hooks/useSession";

const menuItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Inbox", url: "/dashboard/inbox", icon: Inbox },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export const AppSidebar = () => {
  const { session, handleSignOut } = useSession();

  return (
    <Sidebar className="flex h-screen w-56 flex-col text-primary">
      <SidebarHeader
        aria-hidden
        className="ml-1 mt-3 text-2xl font-bold text-primary hover:cursor-pointer"
      >
        <Link href={"/"}>Qypi</Link>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(({ title, url, icon: Icon }) => (
                <SidebarMenuItem key={title}>
                  <Link href={url} className="w-full">
                    <SidebarMenuButton className="w-full gap-2">
                      <Icon className="h-5 w-5" />
                      {title}
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Logout Button at Bottom */}
      {session && (
        <SidebarFooter className="mb-4 mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleSignOut}
                className="w-full gap-2 text-red-500 hover:bg-red-600"
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
