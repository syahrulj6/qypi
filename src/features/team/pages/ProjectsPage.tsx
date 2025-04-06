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
import { useSession } from "~/hooks/useSession";
import { AddTeamMemberModal } from "../components/AddTeamMemberModal";

const TeamProjectsPage = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const router = useRouter();
  const { teamId } = router.query;
  const { session } = useSession();

  const {
    data: teamData,
    isLoading: isTeamLoading,
    refetch: refetchTeamData,
  } = api.team.getTeamById.useQuery(
    { id: teamId as string },
    { enabled: !!teamId },
  );

  const {
    data: projects,
    isLoading: isProjectsLoading,
    refetch: refetchProjects,
  } = api.project.getProject.useQuery(
    { teamId: teamId as string },
    { enabled: !!teamId },
  );

  const { data: teamMembers, isLoading: isMembersLoading } =
    api.team.getTeamMember.useQuery(
      { teamId: teamId as string },
      { enabled: !!teamId },
    );

  const isCurrentUserLead = teamData?.leadId === session?.user.id;

  useEffect(() => {
    if (teamId === undefined) return;
    if (!teamId) router.push("/dashboard");
  }, [teamId, router]);

  const leadProfilePicture = teamData?.lead?.profilePictureUrl;

  const memberProfilePictures =
    teamMembers
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
      label: teamData?.name || "Team Details",
    },
    { label: "Projects" },
  ];

  if (isTeamLoading || isProjectsLoading || isMembersLoading) {
    return <TeamProjectsSkeleton />;
  }

  if (!teamData) {
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
      {isCurrentUserLead && showCreateProject && (
        <CreateProjectModal
          teamId={teamId as string}
          isOpen={showCreateProject}
          onClose={() => setShowCreateProject(false)}
          refetch={refetchProjects}
        />
      )}

      {showAddMember && (
        <AddTeamMemberModal
          teamId={teamId as string}
          refetchTeamData={refetchTeamData}
          isOpen={showAddMember}
          onClose={() => setShowAddMember(false)}
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
                All projects for {teamData.name}
              </p>
            </div>
            <div className="flex items-center gap-2">
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

              {isCurrentUserLead && (
                <Button
                  className="h-8 w-8 rounded-full md:h-10 md:w-10"
                  onClick={() => setShowAddMember(true)}
                >
                  <Plus />
                </Button>
              )}
            </div>
          </div>

          {/* Only show create button for team lead */}
          {isCurrentUserLead && (
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
          )}
        </div>

        {/* PROJECTS LIST */}
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FolderOpen className="h-4 w-4" />
            <h2 className="text-sm font-medium">All Projects</h2>
          </div>

          {isProjectsLoading ? (
            <p>Loading projects...</p>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  teamId={project.teamId}
                  name={project.name}
                  description={project.description}
                  endDate={new Date(project.endDate!)}
                  router={router}
                  team={project.team}
                  isCurrentUserLead={isCurrentUserLead}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No projects yet</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {isCurrentUserLead
                  ? "Get started by creating a new project"
                  : "Only the team lead can create new projects"}
              </p>
              {isCurrentUserLead && (
                <Button
                  className="mt-4"
                  size="sm"
                  onClick={() => setShowCreateProject(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              )}
            </div>
          )}
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamProjectsPage;
