import { useRouter } from "next/router";
import TeamLayout from "../components/TeamLayout";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { Card } from "~/components/ui/card";

const TeamPage = () => {
  const router = useRouter();

  const { data: getTeamsData, isLoading } = api.team.getTeams.useQuery();

  if (isLoading) {
    return (
      <DashboardLayout>
        <TeamLayout breadcrumbItems={[]}>
          <div className="mt-4 flex w-full flex-col">
            <div className="flex justify-end">
              <Button>Create Team</Button>
            </div>
            <div className="grid grid-cols-2 items-center md:grid-cols-4">
              <p>Loading...</p>
            </div>
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  if (!getTeamsData) {
    return (
      <DashboardLayout>
        <TeamLayout breadcrumbItems={[]}>
          <div className="mt-4 flex w-full flex-col">
            <div className="flex justify-end">
              <Button>Create Team</Button>
            </div>
            <div className="grid grid-cols-2 items-center md:grid-cols-4">
              <p>No teams found or an error occurred.</p>
            </div>
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  const pathSegments = router.asPath.split("/").filter(Boolean);
  const filteredSegments = pathSegments.filter(
    (segment) => segment !== "dashboard",
  );

  const breadcrumbLabels: Record<string, string> = {
    team: "Team",
  };

  const breadcrumbItems = filteredSegments.map((segment, index) => {
    const href = "/" + filteredSegments.slice(0, index + 1).join("/");
    return {
      href: index < filteredSegments.length - 1 ? href : undefined,
      label:
        breadcrumbLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1),
    };
  });

  return (
    <DashboardLayout>
      <TeamLayout breadcrumbItems={breadcrumbItems}>
        <div className="mt-4 flex w-full flex-col">
          <div className="flex justify-end">
            <Button>Create Team</Button>
          </div>
          <div className="grid grid-cols-2 items-center gap-4 md:grid-cols-4">
            {getTeamsData.length === 0 ? (
              <div className="col-span-2 flex items-center md:col-span-4">
                <h2 className="font-semibold">There's no team yet!</h2>
              </div>
            ) : (
              getTeamsData.map((team) => (
                <Card className="flex flex-col gap-3 p-4" key={team.id}>
                  <h2 className="text-lg font-semibold md:text-2xl">
                    {team.name}
                  </h2>
                  <p className="text-sm text-gray-600">{team.description}</p>
                </Card>
              ))
            )}
          </div>
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamPage;
