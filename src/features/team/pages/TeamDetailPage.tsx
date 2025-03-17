import { useRouter } from "next/router";
import { useEffect } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import TeamLayout from "../components/TeamLayout";
import { Button } from "~/components/ui/button";

const TeamDetailPage = () => {
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
          <div className="mt-4 flex w-full flex-col">
            <div className="flex justify-end">
              <Button>Add Member</Button>
            </div>
            <div className="grid grid-cols-2 items-center md:grid-cols-4">
              <p>Loading...</p>
            </div>
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  if (!getTeamData) {
    return (
      <DashboardLayout>
        <TeamLayout breadcrumbItems={[]}>
          <div className="mt-4 flex w-full flex-col">
            <div className="flex justify-end">
              <Button>Add Member</Button>
            </div>
            <div className="grid grid-cols-2 items-center md:grid-cols-4">
              <p>No teams found or an error occurred.</p>
            </div>
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <TeamLayout breadcrumbItems={breadcrumbItems}>
        <div className="mt-4 flex w-full flex-col">
          <div className="flex justify-end">
            <Button>Add Member</Button>
          </div>
          <div className="grid grid-cols-2 items-center md:grid-cols-4">
            <h1>{getTeamData.name}</h1>
            <p>{getTeamData.description}</p>
          </div>
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamDetailPage;
