import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import TeamLayout from "../components/TeamLayout";
import { Button } from "~/components/ui/button";
import { FolderOpen, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { ProjectCard } from "../components/ProjectCard";
import TeamProjectsSkeleton from "../components/TeamProjectSkeleton";

const TeamProjectsPage = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const router = useRouter();
  const { teamId } = router.query;

  const { data: getTeamData, isLoading: getTeamDataIsLoading } =
    api.team.getTeamById.useQuery(
      { id: teamId as string },
      { enabled: !!teamId },
    );

  const {
    data: getProjectsData,
    isLoading: getProjectsDataIsLoading,
    refetch: refetchProjectsData,
  } = api.project.getProject.useQuery(
    { teamId: teamId as string },
    { enabled: !!teamId },
  );

  const { data: getTeamMemberData, isLoading: getTeamMemberIsLoading } =
    api.team.getTeamMember.useQuery(
      { teamId: teamId as string },
      { enabled: !!teamId },
    );

  useEffect(() => {
    if (teamId === undefined) return;
    if (!teamId) router.push("/dashboard");
  }, [teamId, router]);

  const leadProfilePicture = getTeamData?.lead?.profilePictureUrl;

  const memberProfilePictures =
    getTeamMemberData
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
    { label: "Projects" },
  ];

  if (getTeamDataIsLoading || getProjectsDataIsLoading) {
    return <TeamProjectsSkeleton />;
  }

  if (!getTeamData) {
    return (
      <DashboardLayout>
        <TeamLayout breadcrumbItems={[]}>
          <div className="mt-4 flex w-full items-center justify-center">
            <p>No team found or an error occurred.</p>
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {showCreateProject && (
        <CreateProjectModal
          teamId={teamId as string}
          isOpen={showCreateProject}
          onClose={() => setShowCreateProject(false)}
          refetch={refetchProjectsData}
        />
      )}

      <TeamLayout breadcrumbItems={breadcrumbItems}>
        {/* HEADER */}
        <div className="flex justify-between md:mr-8">
          <div className="flex flex-1 flex-col gap-1 md:gap-2">
            <div className="flex flex-col gap-1">
              <h1 className="text-base font-semibold md:text-2xl">
                Team Projects
              </h1>
              <p className="text-xs text-muted-foreground md:text-sm">
                All projects for {getTeamData.name}
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
          <div className="flex items-center gap-4">
            <Button
              className="center gap-1 md:flex"
              onClick={() => setShowCreateProject(true)}
              size={window.innerWidth < 640 ? "sm" : "default"}
            >
              <Plus />
              Create Project
            </Button>
          </div>
        </div>

        {/* PROJECTS LIST */}
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FolderOpen className="h-4 w-4" />
            <h2 className="text-sm font-medium">All Projects</h2>
          </div>

          {getProjectsDataIsLoading ? (
            <p>Loading projects...</p>
          ) : getProjectsData && getProjectsData.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getProjectsData.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  teamId={project.teamId}
                  name={project.name}
                  description={project.description}
                  endDate={new Date(project.endDate!)}
                  router={router}
                  team={project.team}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No projects yet</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Get started by creating a new project
              </p>
              <Button
                className="mt-4"
                size="sm"
                onClick={() => setShowCreateProject(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          )}
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamProjectsPage;
