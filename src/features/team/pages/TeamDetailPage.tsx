import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import TeamLayout from "../components/TeamLayout";
import { TeamDetailMenuButton } from "../components/TeamDetailMenuButton";
import { TeamMemberCard } from "../components/TeamMemberCard";
import { FolderOpen, LoaderCircle, Users } from "lucide-react";
import { CreateProjectModal } from "../components/CreateProjectModal";
import { ProjectCard } from "../components/ProjectCard";
import { AddTeamMemberModal } from "../components/AddTeamMemberModal";
import TeamDetailSkeleton from "../components/TeamDetailSkeleton";

const TeamDetailPage = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const router = useRouter();
  const { teamId } = router.query;

  useEffect(() => {
    if (teamId === undefined) return;
    if (!teamId) router.push("/dashboard");
  }, [teamId, router]);

  const { data: currentUser } = api.profile.getProfile.useQuery();

  const { data: teamData, isLoading: isTeamLoading } =
    api.team.getTeamById.useQuery(
      { id: teamId as string },
      { enabled: !!teamId },
    );

  const {
    data: teamMembers,
    isLoading: isMembersLoading,
    refetch: refetchTeamMembers,
  } = api.team.getTeamMember.useQuery({
    teamId: teamData?.id || "",
  });

  const {
    data: projects,
    refetch: refetchProjects,
    isLoading: isProjectsLoading,
  } = api.project.getProject.useQuery({
    teamId: teamData?.id || "",
  });

  // Check if current user is the team lead
  const isCurrentUserLead = currentUser?.userId === teamData?.leadId;

  const breadcrumbItems = [
    { href: "/dashboard/team", label: "Team" },
    { label: teamData?.name || "Team Details" },
  ];

  if (isTeamLoading || isMembersLoading || isProjectsLoading) {
    return <TeamDetailSkeleton />;
  }

  if (!teamData) {
    return (
      <DashboardLayout>
        <TeamLayout breadcrumbItems={[]}>
          <div className="mt-4 flex w-full items-center justify-center">
            <p>No teams found or an error occurred.</p>
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TeamLayout breadcrumbItems={breadcrumbItems}>
        {showCreateProject && isCurrentUserLead && (
          <CreateProjectModal
            teamId={teamData.id}
            isOpen={showCreateProject}
            onClose={() => setShowCreateProject(false)}
            refetch={refetchProjects}
          />
        )}

        {showAddMember && isCurrentUserLead && (
          <AddTeamMemberModal
            teamId={teamData.id}
            isOpen={showAddMember}
            onClose={() => setShowAddMember(false)}
            refetchTeamData={refetchTeamMembers}
            refetchProjectData={refetchProjects}
          />
        )}

        {isCurrentUserLead && (
          <TeamDetailMenuButton
            onOpenAddMember={() => setShowAddMember(true)}
            onOpenCreateProject={() => setShowCreateProject(true)}
          />
        )}

        <div className="flex w-full flex-col gap-1 md:mt-4 md:gap-2">
          {/* Team Info Section */}
          <div className="flex flex-col tracking-tight">
            <p className="text-md text-muted-foreground md:text-base">
              Team Name
            </p>
            <h1 className="text-base font-semibold md:text-xl">
              {teamData.name}
            </h1>
          </div>

          {teamData.description && (
            <div className="flex flex-col">
              <p className="text-md text-muted-foreground md:text-base">
                Team Description
              </p>
              <p className="text-sm">{teamData.description}</p>
            </div>
          )}

          {/* Team Members Section */}
          <div className="flex flex-col gap-1 md:gap-2">
            <p className="text-md flex items-center gap-2 text-muted-foreground md:text-base">
              Team Members <Users className="w-3 md:w-4" />
            </p>
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted p-3 md:grid-cols-5 md:p-4">
              {isMembersLoading ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : (
                teamMembers?.map((member) => (
                  <TeamMemberCard
                    key={member.id}
                    currentUserId={currentUser?.userId || ""}
                    teamId={teamData.id}
                    teamMemberRefetch={refetchTeamMembers}
                    projectRefetch={refetchProjects}
                    picture={member.user.profilePictureUrl}
                    leadId={teamData.leadId}
                    memberId={member.user.userId}
                    username={member.user.username}
                  />
                ))
              )}
            </div>
          </div>

          {/* Projects Section */}
          <div className="mt-2 flex flex-col gap-1 md:mt-4 md:gap-2">
            <p className="text-md flex items-center gap-2 text-muted-foreground md:text-base">
              Projects <FolderOpen className="w-3 md:w-4" />
            </p>
            <div className="grid grid-cols-1 gap-3 rounded-lg bg-muted p-3 md:grid-cols-3 md:p-4">
              {isProjectsLoading ? (
                <LoaderCircle className="h-5 w-5 animate-spin" />
              ) : projects && projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    teamId={teamData.id}
                    name={project.name}
                    description={project.description}
                    endDate={new Date(project.endDate!)}
                    router={router}
                    team={project.team}
                    isCurrentUserLead={isCurrentUserLead ?? ""}
                  />
                ))
              ) : (
                <p className="text-muted-foreground">No projects found</p>
              )}
            </div>
          </div>
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamDetailPage;
