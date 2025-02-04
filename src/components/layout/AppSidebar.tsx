"use client";

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
} from "~/components/ui/sidebar";
import { Home, Inbox, Calendar, Search, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "~/lib/supabase/client";
import { Session } from "@supabase/supabase-js"; // Import the Session type

const menuItems = [
  { title: "Home", url: "/dashboard", icon: Home },
  { title: "Inbox", url: "/dashboard/inbox", icon: Inbox },
  { title: "Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "Search", url: "/dashboard/search", icon: Search },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export const AppSidebar = () => {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      } else {
        setSession(data.session);
      }
    };

    fetchSession();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      router.push("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Sidebar className="h-screen w-56 bg-gray-900 text-white">
      <SidebarHeader
        aria-hidden
        className="ml-1 mt-3 text-2xl font-bold text-blue-500 hover:cursor-pointer"
      >
        <Link href={"/"}>QYPI</Link>
      </SidebarHeader>
      <SidebarContent>
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

        {/* Logout Section */}
        {session && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleSignOut}
                    className="gap-2 text-red-500 hover:bg-red-600"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
