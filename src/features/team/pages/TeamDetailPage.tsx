import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import TeamLayout from "../components/TeamLayout";
import { Button } from "~/components/ui/button";
import { TeamDetailMenuButton } from "../components/TeamDetailMenuButton";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { TeamMemberCard } from "../components/TeamMemberCard";
import { FolderOpen, Users } from "lucide-react";

const TeamDetailPage = () => {
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id === undefined) return;
    if (!id) router.push("/dashboard");
  }, [id, router]);

  const { data: getTeamData, isLoading } = api.team.getTeamById.useQuery(
    { id: id as string },
    { enabled: !!id },
  );

  const { data: getTeamMemberData } = api.team.getTeamMember.useQuery({
    teamId: getTeamData?.id || "",
  });

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
        <div className="flex w-full flex-col gap-1 md:mt-4 md:gap-2">
          <div className="flex flex-col tracking-tight">
            <p className="text-md text-muted-foreground md:text-base">
              Team Name
            </p>
            <h1 className="text-base font-semibold md:text-xl">
              {getTeamData.name}
            </h1>
          </div>
          <div className="flex flex-col">
            <p className="text-md text-muted-foreground md:text-base">
              Team Description
            </p>
            <p className="text-sm">{getTeamData.description}</p>
          </div>
          <div className="flex flex-col gap-1 md:gap-2">
            <p className="text-md flex items-center gap-2 text-muted-foreground md:text-base">
              Team Member <Users className="w-3 md:w-4" />
            </p>
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted px-2 py-4 md:grid-cols-4">
              {getTeamMemberData?.map((member) => (
                <TeamMemberCard
                  key={member.id}
                  leadId={getTeamData.leadId}
                  memberId={member.user.userId}
                  username={member.user.username}
                />
              ))}
            </div>
          </div>
          <div className="mt-2 flex flex-col gap-1 md:mt-4 md:gap-2">
            <p className="text-md flex items-center gap-2 text-muted-foreground md:text-base">
              Projects <FolderOpen className="w-3 md:w-4" />
            </p>
          </div>
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamDetailPage;
