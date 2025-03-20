import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import TeamLayout from "../components/TeamLayout";
import { Button } from "~/components/ui/button";
import { TeamDetailMenuButton } from "../components/TeamDetailMenuButton";

const TeamDetailPage = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id === undefined) return;
    if (!id) router.push("/dashboard");
  }, [id, router]);

  const {
    data: getTeamData,
    isLoading,
    refetch,
  } = api.team.getTeamById.useQuery({ id: id as string }, { enabled: !!id });

  useEffect(() => {
    console.log("ID from router:", id);
    console.log("Team data:", getTeamData);
  }, [id, getTeamData]);

  const breadcrumbItems = [
    { href: "/dashboard/team", label: "Team" },
    { label: getTeamData?.name || "Team Details" },
  ];

  if (isLoading) {
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

  if (!getTeamData) {
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
        <TeamDetailMenuButton
          onOpenAddMember={() => setShowAddMember(true)}
          onOpenCreateProject={() => setShowCreateProject(true)}
        />
        <div className="mt-4 flex w-full flex-col">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col tracking-tight">
              <p className="text-md text-muted-foreground md:text-base">
                Team Name
              </p>
              <h1 className="text-lg font-semibold md:text-xl">
                {getTeamData.name}
              </h1>
            </div>
            <div className="flex flex-col">
              <p className="text-md text-muted-foreground md:text-base">
                Team Description
              </p>
              <p className="text-sm">{getTeamData.description}</p>
            </div>
          </div>
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamDetailPage;
