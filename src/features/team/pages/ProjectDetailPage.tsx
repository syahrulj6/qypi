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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Plus,
  SquarePen,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CreateTaskModal } from "../components/CreateTaskModal";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  color?: string;
};

const ProjectDetailPage = () => {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendarApi, setCalendarApi] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const router = useRouter();
  const { teamId, projectId } = router.query;

  useEffect(() => {
    if (teamId === undefined || projectId === undefined) return;
    if (!teamId || !projectId) router.push("/dashboard");
  }, [teamId, projectId, router]);

  const { data: getProjectData, isLoading: getProjectDataIsLoading } =
    api.project.getProjectById.useQuery(
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

  const leadProfilePicture = getProjectData?.team?.lead?.profilePictureUrl;

  useEffect(() => {
    if (getTasksData) {
      const mappedEvents = getTasksData
        .filter((task) => task.createdAt)
        .map((task) => ({
          id: task.id,
          title: task.title,
          start: task.createdAt as Date,
          end: task.dueDate || undefined,
          color: task.status === "Completed" ? "green" : "red",
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
      <TeamLayout breadcrumbItems={breadcrumbItems}>
        {/* HEADER */}
        <div className="flex justify-between md:mr-8">
          <div className="flex flex-1 flex-col gap-1 md:gap-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold md:text-2xl">
                  {getProjectData.name}
                </h1>
                <SquarePen className="w-4 text-muted-foreground md:w-4" />
              </div>
              <p className="text-xs text-muted-foreground md:text-sm">
                {getProjectData.description}
              </p>
            </div>
            <div className="mt-1 flex flex-wrap -space-x-3 md:mt-2">
              {avatarsToShow.map((picture, index) => (
                <Avatar
                  key={index}
                  className="size-9 border-4 border-white md:size-10"
                >
                  <AvatarFallback>{picture ? "" : "U"}</AvatarFallback>
                  <AvatarImage src={picture ?? ""} className="rounded-full" />
                </Avatar>
              ))}
              {remainingMembers > 0 && (
                <Avatar className="ml-4 size-9 border-4 border-white md:size-10">
                  <AvatarFallback>+{remainingMembers}</AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                className="hidden items-center gap-2 md:flex"
                variant="outline"
                size="sm"
              >
                <CalendarDays /> Calendar
              </Button>
              <Button variant="outline" size="icon" className="md:hidden">
                <Ellipsis />
              </Button>
              <Button
                className="hidden items-center gap-1 md:flex"
                onClick={() => setShowCreateTask(true)}
              >
                <Plus />
                Create Task
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToday}
                className="hidden md:flex"
              >
                Today
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePrev}
                  className="size-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-sm text-muted-foreground">
                  {formattedDate}
                </h2>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNext}
                  className="size-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="mt-4 rounded-lg border bg-white p-4 shadow-sm">
          {getTaskDataLoading ? (
            <p>Loading...</p>
          ) : (
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              events={events}
              headerToolbar={false}
              eventClick={(info) => alert(`Task: ${info.event.title}`)}
              datesSet={(arg) => setCurrentDate(arg.start)}
              ref={(ref) => {
                if (ref) {
                  setCalendarApi(ref.getApi());
                }
              }}
            />
          )}
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default ProjectDetailPage;
