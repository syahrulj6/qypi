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
  Settings,
  LogOut,
  NotebookPen,
  UsersRound,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "~/hooks/useSession";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: (pathname: string) => boolean;
};

const mainMenuItems: MenuItem[] = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: (pathname) => pathname === "/dashboard",
  },
  {
    title: "My Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
    isActive: (pathname) => pathname === "/dashboard/calendar",
  },
  {
    title: "My Inbox",
    url: "/dashboard/inbox",
    icon: Inbox,
    isActive: (pathname) => pathname === "/dashboard/inbox",
  },
  {
    title: "My Notes",
    url: "/dashboard/notes",
    icon: NotebookPen,
    isActive: (pathname) => pathname === "/dashboard/notes",
  },
  {
    title: "Team",
    url: "/dashboard/team",
    icon: UsersRound,
    isActive: (pathname) => pathname.startsWith("/dashboard/team"),
  },
];

const otherMenuItems: MenuItem[] = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    isActive: (pathname) => pathname === "/dashboard/settings",
  },
];

const teamSubmenuItems = [
  { title: "Overview", path: "" },
  { title: "Members", path: "members" },
  { title: "Projects", path: "projects" },
  { title: "Settings", path: "settings", leadOnly: true },
];

export const AppSidebar = () => {
  const { session, handleSignOut } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>(
    {},
  );
  const [isTeamMenuExpanded, setIsTeamMenuExpanded] = useState(
    pathname?.startsWith("/dashboard/team"),
  );

  const { data: teams, isLoading: teamsLoading } = api.team.getTeams.useQuery();
  const { data: currentUser } = api.profile.getProfile.useQuery();

  const currentTeamId = pathname?.split("/")[3];

  const toggleTeamExpansion = (teamId: string) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const handleTeamMenuClick = () => {
    const newExpandedState = !isTeamMenuExpanded;
    setIsTeamMenuExpanded(newExpandedState);

    if (newExpandedState && !pathname?.startsWith("/dashboard/team")) {
      router.push("/dashboard/team");
    }
  };

  useEffect(() => {
    if (teams && currentTeamId) {
      setExpandedTeams((prev) => ({
        ...prev,
        [currentTeamId]: true,
      }));
    }
  }, [teams, currentTeamId]);

  const renderMenuItem = ({ title, url, icon: Icon, isActive }: MenuItem) => {
    const active = isActive ? isActive(pathname || "") : pathname === url;
    return (
      <SidebarMenuItem key={title}>
        <Link href={url}>
          <Button
            variant="ghost"
            className={`flex w-full items-center justify-start gap-4 ${active && "bg-primary hover:bg-primary"}`}
          >
            <Icon
              className={`h-5 w-5 ${active ? "text-white" : "text-muted-foreground"}`}
            />
            <span className={active ? "text-white" : "text-muted-foreground"}>
              {title}
            </span>
          </Button>
        </Link>
      </SidebarMenuItem>
    );
  };

  const renderTeamSubmenu = (team: {
    id: string;
    name: string;
    leadId: string;
  }) => {
    const isTeamActive = currentTeamId === team.id;
    const isTeamExpanded = expandedTeams[team.id] || isTeamActive;
    const isTeamLead = team.leadId === currentUser?.userId;

    return (
      <div key={team.id} className="flex flex-col">
        <Button
          variant="ghost"
          className={`flex w-full items-center justify-start gap-2 px-4 py-2 ${isTeamActive ? "bg-accent" : ""}`}
          onClick={() => toggleTeamExpansion(team.id)}
        >
          {isTeamExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="truncate">{team.name}</span>
        </Button>

        {isTeamExpanded && (
          <div className="ml-6 flex flex-col border-l pl-2">
            {teamSubmenuItems.map((item) => {
              if (item.leadOnly && !isTeamLead) return null;

              const fullPath =
                `/dashboard/team/${team.id}/${item.path}`.replace(/\/$/, "");
              const isActive = pathname === fullPath;

              return (
                <Link key={item.path} href={fullPath}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${isActive ? "bg-accent" : ""}`}
                  >
                    {item.title}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex">
      <Sidebar className="flex h-screen w-56 flex-col">
        <SidebarHeader className="ml-1 mt-3 text-2xl font-bold text-primary hover:cursor-pointer">
          <Link href="/">Qypi</Link>
        </SidebarHeader>

        <SidebarContent className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              MAIN MENU
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2">
                {mainMenuItems.map((item) => {
                  if (item.title === "Team") {
                    return (
                      <div key="team-menu" className="flex flex-col">
                        <Button
                          variant="ghost"
                          className={`flex w-full items-center justify-start gap-4 ${item.isActive?.(pathname || "") && "bg-primary hover:bg-primary"}`}
                          onClick={handleTeamMenuClick}
                        >
                          <item.icon
                            className={`h-5 w-5 ${item.isActive?.(pathname || "") ? "text-white" : "text-muted-foreground"}`}
                          />
                          <span
                            className={
                              item.isActive?.(pathname || "")
                                ? "text-white"
                                : "text-muted-foreground"
                            }
                          >
                            {item.title}
                          </span>
                        </Button>

                        {isTeamMenuExpanded && teams && (
                          <div className="ml-6 mt-1 flex flex-col border-l pl-2">
                            {teams.map(renderTeamSubmenu)}
                          </div>
                        )}
                      </div>
                    );
                  }
                  return renderMenuItem(item);
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              OTHERS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2">
                {otherMenuItems.map(renderMenuItem)}
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
                  variant="destructive"
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
    </div>
  );
};
