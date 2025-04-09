import { useState } from "react";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardSection } from "./DashboardSection";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
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
  Menu,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "~/hooks/useSession";
import { SessionRoute } from "./SessionRoute";
import { api } from "~/utils/api";

const mainMenuItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: LayoutDashboard,
    isActive: (pathname: string) => pathname === "/dashboard",
  },
  {
    title: "My Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
    isActive: (pathname: string) => pathname === "/dashboard/calendar",
  },
  {
    title: "My Inbox",
    url: "/dashboard/inbox",
    icon: Inbox,
    isActive: (pathname: string) => pathname === "/dashboard/inbox",
  },
  {
    title: "My Notes",
    url: "/dashboard/notes",
    icon: NotebookPen,
    isActive: (pathname: string) => pathname === "/dashboard/notes",
  },
  {
    title: "Team",
    url: "/dashboard/team",
    icon: UsersRound,
    isActive: (pathname: string) => pathname.startsWith("/dashboard/team"),
  },
];

const otherMenuItems = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    isActive: (pathname: string) => pathname === "/dashboard/settings",
  },
];

const teamSubmenuItems = [
  { title: "Overview", path: "" },
  { title: "Members", path: "members" },
  { title: "Projects", path: "projects" },
  { title: "Settings", path: "settings", leadOnly: true },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleSignOut } = useSession();
  const [open, setOpen] = useState(false);
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

  const renderMenuItem = ({
    title,
    url,
    icon: Icon,
    isActive,
  }: (typeof mainMenuItems)[0]) => {
    const active = isActive ? isActive(pathname || "") : pathname === url;
    return (
      <Link href={url} key={title} onClick={() => setOpen(false)}>
        <Button
          variant="ghost"
          className={`flex w-full items-center justify-start gap-4 px-4 py-2 ${active ? "bg-primary hover:bg-primary" : ""}`}
        >
          <Icon
            className={`h-5 w-5 ${active ? "text-white" : "text-muted-foreground"}`}
          />
          <span className={active ? "text-white" : "text-muted-foreground"}>
            {title}
          </span>
        </Button>
      </Link>
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
                <Link
                  key={item.path}
                  href={fullPath}
                  onClick={() => setOpen(false)}
                >
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
    <SessionRoute>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <aside className="hidden md:flex md:w-64">
            <AppSidebar />
          </aside>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

            <SheetTrigger asChild className="-ml-2 mt-2 md:ml-0">
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
                <div className="flex flex-col gap-1">
                  <div className="mb-4 ml-1 text-2xl font-bold text-primary">
                    <Link href="/" onClick={() => setOpen(false)}>
                      Qypi
                    </Link>
                  </div>

                  <div className="mb-6 flex flex-col gap-1">
                    <p className="px-4 text-sm text-muted-foreground">
                      MAIN MENU
                    </p>
                    {mainMenuItems.map((item) => {
                      if (item.title === "Team") {
                        return (
                          <div key="team-menu" className="flex flex-col">
                            <Button
                              variant="ghost"
                              className={`flex w-full items-center justify-start gap-4 px-4 py-2 ${item.isActive?.(pathname || "") ? "bg-primary hover:bg-primary" : ""}`}
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
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="px-4 text-sm text-muted-foreground">OTHERS</p>
                    {otherMenuItems.map(renderMenuItem)}
                  </div>
                </div>

                <Button
                  onClick={() => {
                    handleSignOut();
                    setOpen(false);
                  }}
                  variant="destructive"
                  className="flex w-full items-center justify-start gap-4 px-4 py-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex flex-1 flex-col">
            <DashboardSection>{children}</DashboardSection>
          </div>
        </div>
      </SidebarProvider>
    </SessionRoute>
  );
}
