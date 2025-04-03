import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import TeamLayout from "../components/TeamLayout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "~/components/ui/button";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Plus,
  Settings,
  SquarePen,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CreateTaskModal } from "../components/CreateTaskModal";
import { UpdateProjectTitleModal } from "../components/UpdateProjectTitleModal";
import { useSession } from "~/hooks/useSession";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { TaskModal } from "../components/TaskModal";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  display?: string;
  allDay?: boolean;
};

const ProjectDetailPage = () => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showUpdateProjectTitle, setShowUpdateProjectTitle] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendarApi, setCalendarApi] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { session } = useSession();

  const router = useRouter();
  const { teamId, projectId } = router.query;

  useEffect(() => {
    if (teamId === undefined || projectId === undefined) return;
    if (!teamId || !projectId) router.push("/dashboard");
  }, [teamId, projectId, router]);

  const {
    data: getProjectData,
    isLoading: getProjectDataIsLoading,
    refetch: refetchProjectData,
  } = api.project.getProjectById.useQuery(
    { projectId: projectId as string },
    { enabled: !!projectId },
  );

  const { data: getTeamData, isLoading: getTeamDataIsLoading } =
    api.team.getTeamById.useQuery(
      { id: teamId as string },
      { enabled: !!teamId },
    );

  const {
    data: getTasksData,
    isLoading: getTaskDataLoading,
    refetch: refetchTaskData,
  } = api.task.getTask.useQuery();

  const isLead = session?.user?.id === getTeamData?.leadId;

  const leadProfilePicture = getProjectData?.team?.lead?.profilePictureUrl;

  useEffect(() => {
    if (getTasksData) {
      const mappedEvents = getTasksData
        .filter((task) => task.createdAt && task.dueDate)
        .map((task) => ({
          id: task.id,
          title: task.title,
          start: task.createdAt as Date,
          end: task.dueDate as Date,
          color: task.status === "Completed" ? "#22c55e" : "#ccc",
          display: "block",
          allDay: true,
        }));
      setEvents(mappedEvents);
    }
  }, [getTasksData]);

  const handlePrev = () => {
    if (calendarApi) {
      calendarApi.prev();
      updateCurrentDate();
    }
  };

  const handleNext = () => {
    if (calendarApi) {
      calendarApi.next();
      updateCurrentDate();
    }
  };

  const handleToday = () => {
    if (calendarApi) {
      calendarApi.today();
      updateCurrentDate();
    }
  };

  const updateCurrentDate = () => {
    if (calendarApi) {
      const date = calendarApi.getDate();
      setCurrentDate(date);
    }
  };

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const memberProfilePictures =
    getProjectData?.team?.members
      ?.filter(
        (member) => member.user?.profilePictureUrl !== leadProfilePicture,
      )
      .map((member) => member.user?.profilePictureUrl) || [];

  const profilePictures = [leadProfilePicture, ...memberProfilePictures].filter(
    Boolean,
  );

  const maxAvatars = 4;
  const remainingMembers = Math.max(0, profilePictures.length - maxAvatars);
  const avatarsToShow = profilePictures.slice(0, maxAvatars);

  const breadcrumbItems = [
    { href: "/dashboard/team", label: "Team" },
    {
      href: `/dashboard/team/${teamId}`,
      label: getTeamData?.name || "Team Details",
    },
    { label: getProjectData?.name || "Project Details" },
  ];

  if (getProjectDataIsLoading || getTeamDataIsLoading) {
    return (
      <DashboardLayout>
        <TeamLayout breadcrumbItems={[]}>
          <div className="mt-4 flex w-full items-center justify-center">
            <p>Loading...</p>
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  if (!getProjectData) {
    return (
      <DashboardLayout>
        <TeamLayout breadcrumbItems={[]}>
          <div className="mt-4 flex w-full items-center justify-center">
            <p>No project found or an error occurred.</p>
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {showCreateTask && (
        <CreateTaskModal
          projectId={getProjectData.id}
          isOpen={showCreateTask}
          onClose={() => setShowCreateTask(false)}
          refetch={refetchTaskData}
        />
      )}
      {showUpdateProjectTitle && (
        <UpdateProjectTitleModal
          projectId={getProjectData.id}
          projectName={getProjectData.name}
          isOpen={showUpdateProjectTitle}
          onClose={() => setShowUpdateProjectTitle(false)}
          refetch={refetchProjectData}
        />
      )}
      <TaskModal
        taskId={selectedTaskId ?? ""}
        isOpen={!!selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
        refetch={refetchTaskData}
      />
      <TeamLayout breadcrumbItems={breadcrumbItems}>
        {/* HEADER */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start md:gap-8">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold sm:text-2xl">
                  {getProjectData.name}
                </h1>
                {isLead && (
                  <button
                    onClick={() => setShowUpdateProjectTitle(true)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <SquarePen className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {getProjectData.description}
              </p>
            </div>
            <div className="flex items-center -space-x-2">
              {avatarsToShow.map((picture, index) => (
                <Avatar
                  key={index}
                  className="h-8 w-8 border-2 border-background sm:h-10 sm:w-10"
                >
                  <AvatarFallback>{picture ? "" : "U"}</AvatarFallback>
                  <AvatarImage src={picture ?? ""} />
                </Avatar>
              ))}
              {remainingMembers > 0 && (
                <Avatar className="h-8 w-8 border-2 border-background sm:h-10 sm:w-10">
                  <AvatarFallback className="text-xs">
                    +{remainingMembers}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              {/* Mobile menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 sm:hidden"
                  >
                    <Ellipsis className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isLead && (
                    <>
                      <DropdownMenuItem
                        onClick={() => setShowCreateTask(true)}
                        className="cursor-pointer"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Task
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/dashboard/team/${teamId}/projects/${projectId}/settings`,
                          )
                        }
                        className="cursor-pointer"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={handleToday}
                    className="cursor-pointer"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Today
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Desktop buttons */}
              <div className="hidden items-center gap-2 sm:flex">
                {isLead && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/dashboard/team/${teamId}/projects/${projectId}/settings`,
                        )
                      }
                      className="hidden items-center gap-2 sm:flex"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden items-center gap-2 sm:flex"
                    >
                      <CalendarDays className="h-4 w-4" />
                      <span>Calendar</span>
                    </Button>
                  </>
                )}
                {isLead && (
                  <Button
                    onClick={() => setShowCreateTask(true)}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Task</span>
                  </Button>
                )}
              </div>
            </div>

            {/* DATE NAVIGATION */}
            <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="hidden sm:flex"
              >
                Today
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="min-w-[120px] text-center text-sm font-medium text-muted-foreground sm:min-w-[150px]">
                  {formattedDate}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="mt-4 rounded-lg border bg-background p-2 shadow-sm sm:p-4">
          {getTaskDataLoading ? (
            <div className="flex h-64 items-center justify-center">
              <p>Loading calendar...</p>
            </div>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              headerToolbar={false}
              eventClick={(info) => {
                setSelectedTaskId(info.event.id);
              }}
              datesSet={(arg) => setCurrentDate(arg.start)}
              ref={(ref) => {
                if (ref) {
                  setCalendarApi(ref.getApi());
                }
              }}
              eventDisplay="block"
              eventColor="#3b82f6"
              eventTextColor="var(--primary-foreground)"
              eventBorderColor="transparent"
              height="auto"
              contentHeight="auto"
              aspectRatio={1.35}
              dayMaxEventRows={3}
              dayHeaderFormat={{
                weekday: "short",
                day: "numeric",
              }}
              eventClassNames="cursor-pointer"
            />
          )}
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default ProjectDetailPage;
