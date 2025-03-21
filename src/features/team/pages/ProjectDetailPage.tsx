import { useRouter } from "next/router";
import { useEffect } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import TeamLayout from "../components/TeamLayout";

const ProjectDetailPage = () => {
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
      <TeamLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex w-full flex-col gap-1 md:mt-4 md:gap-2">
          <div className="flex flex-col tracking-tight">
            <p className="text-md text-muted-foreground md:text-base">
              Project Name
            </p>
            <h1 className="text-base font-semibold md:text-xl">
              {getProjectData.name}
            </h1>
          </div>

          <div className="flex flex-col">
            <p className="text-md text-muted-foreground md:text-base">
              Project Description
            </p>
            <p className="text-sm">{getProjectData.description}</p>
          </div>

          <div className="flex flex-col">
            <p className="text-md text-muted-foreground md:text-base">
              Project End Date
            </p>
            <p className="text-sm">
              {new Date(getProjectData.endDate!).toDateString()}
            </p>
          </div>

          {getTeamData && (
            <div className="mt-4 flex flex-col gap-1 md:gap-2">
              <p className="text-md text-muted-foreground md:text-base">Team</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{getTeamData.name}</p>
                <p className="text-sm text-muted-foreground">
                  {getTeamData.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default ProjectDetailPage;
