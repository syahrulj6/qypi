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

const mainMenuItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Calendar", url: "/dashboard/calendar", icon: Calendar },
  { title: "My Inbox", url: "/dashboard/inbox", icon: Inbox },
  { title: "My Notes", url: "/dashboard/notes", icon: NotebookPen },
  { title: "Team", url: "/dashboard/team", icon: UsersRound },
];

const otherMenuItems = [
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export const AppSidebar = () => {
  const { session, handleSignOut } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>(
    {},
  );
  const isTeamRoute = pathname?.startsWith("/dashboard/team");

  const [isTeamMenuExpanded, setIsTeamMenuExpanded] = useState(isTeamRoute);

  const { data: teams, isLoading: teamsLoading } = api.team.getTeams.useQuery();

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

    if (newExpandedState && !isTeamRoute) {
      router.push("/dashboard/team");
    }
  };
  useEffect(() => {
    if (teams) {
      if (currentTeamId) {
        setExpandedTeams((prev) => ({
          ...prev,
          [currentTeamId]: true,
        }));
      }

      if (isTeamRoute && !isTeamMenuExpanded) {
        setIsTeamMenuExpanded(true);
      }
    }
  }, [teams, currentTeamId, isTeamRoute, isTeamMenuExpanded]);

  return (
    <div className="flex">
      {/* Main Sidebar */}
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
              MAIN MENU
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2">
                {mainMenuItems.map(({ title, url, icon: Icon }, index) => {
                  const isActive =
                    pathname === url ||
                    (url === "/dashboard/team" &&
                      pathname?.startsWith("/dashboard/team"));

                  if (title === "Team") {
                    return (
                      <div key={index} className="flex flex-col">
                        <Button
                          variant="ghost"
                          className={`flex w-full items-center justify-start gap-4 ${isActive && "bg-primary hover:bg-primary"} transition-colors`}
                          onClick={handleTeamMenuClick}
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

                        {/* Team Submenu - shown when team menu is expanded */}
                        {isTeamMenuExpanded && teams && (
                          <div className="ml-6 mt-1 flex flex-col border-l pl-2">
                            {teams.map((team) => {
                              const isTeamActive = currentTeamId === team.id;
                              const isTeamExpanded =
                                expandedTeams[team.id] || isTeamActive;

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
                                    <span className="truncate">
                                      {team.name}
                                    </span>
                                  </Button>

                                  {isTeamExpanded && (
                                    <div className="ml-6 flex flex-col border-l pl-2">
                                      <Link href={`/dashboard/team/${team.id}`}>
                                        <Button
                                          variant="ghost"
                                          className={`w-full justify-start ${pathname === `/dashboard/team/${team.id}` ? "bg-accent" : ""}`}
                                        >
                                          Overview
                                        </Button>
                                      </Link>
                                      <Link
                                        href={`/dashboard/team/${team.id}/members`}
                                      >
                                        <Button
                                          variant="ghost"
                                          className={`w-full justify-start ${pathname === `/dashboard/team/${team.id}/members` ? "bg-accent" : ""}`}
                                        >
                                          Members
                                        </Button>
                                      </Link>
                                      <Link
                                        href={`/dashboard/team/${team.id}/projects`}
                                      >
                                        <Button
                                          variant="ghost"
                                          className={`w-full justify-start ${pathname === `/dashboard/team/${team.id}/projects` ? "bg-accent" : ""}`}
                                        >
                                          Projects
                                        </Button>
                                      </Link>
                                      <Link
                                        href={`/dashboard/team/${team.id}/settings`}
                                      >
                                        <Button
                                          variant="ghost"
                                          className={`w-full justify-start ${pathname === `/dashboard/team/${team.id}/settings` ? "bg-accent" : ""}`}
                                        >
                                          Settings
                                        </Button>
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <SidebarMenuItem key={index}>
                      <Link href={url}>
                        <Button
                          variant="ghost"
                          className={`flex w-full items-center justify-start gap-4 ${isActive && "bg-primary hover:bg-primary"} transition-colors`}
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

          {/* Other Menu Items */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              OTHERS
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col gap-2">
                {otherMenuItems.map(({ title, url, icon: Icon }, index) => {
                  const isActive = pathname === url;
                  return (
                    <SidebarMenuItem key={index}>
                      <Link href={url}>
                        <Button
                          variant="ghost"
                          className={`flex w-full items-center justify-start gap-4 ${isActive && "bg-primary hover:bg-primary"} transition-colors`}
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
    </div>
  );
};
