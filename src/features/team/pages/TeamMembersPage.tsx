import { useRouter } from "next/router";
import { useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import TeamLayout from "../components/TeamLayout";
import { Button } from "~/components/ui/button";
import { UserPlus, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { AddTeamMemberModal } from "../components/AddTeamMemberModal";
import { toast } from "sonner";
import { Skeleton } from "~/components/ui/skeleton";

const TeamMembersPage = () => {
  const router = useRouter();
  const { teamId } = router.query;

  const [showAddMember, setShowAddMember] = useState(false);

  const {
    data: teamData,
    isLoading: teamLoading,
    refetch: refetchTeamData,
  } = api.team.getTeamById.useQuery(
    { id: teamId as string },
    { enabled: !!teamId },
  );

  const {
    data: teamMembers,
    isLoading: membersLoading,
    refetch: refetchTeamMembers,
  } = api.team.getTeamMember.useQuery(
    { teamId: teamId as string },
    { enabled: !!teamId },
  );

  const removeMember = api.team.deleteTeamMember.useMutation();

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMember.mutateAsync({
        teamId: teamId as string,
        userId,
      });
      toast.success("Member removed successfully");
      refetchTeamMembers();
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  if (teamLoading || membersLoading) {
    return (
      <DashboardLayout>
        <TeamLayout breadcrumbItems={[]}>
          <div className="mt-4 flex w-full flex-col gap-8">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-10 w-1/6" />
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded border p-4"
                >
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-20" />
                </div>
              ))}
            </div>
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  if (!teamData) {
    return (
      <DashboardLayout>
        <TeamLayout breadcrumbItems={[]}>
          <div className="mt-4 flex w-full items-center justify-center">
            <p>Team not found</p>
          </div>
        </TeamLayout>
      </DashboardLayout>
    );
  }

  const breadcrumbItems = [
    { href: "/dashboard/team", label: "Team" },
    { href: `/dashboard/team/${teamId}`, label: teamData.name },
    { label: "Members" },
  ];

  return (
    <DashboardLayout>
      {showAddMember && (
        <AddTeamMemberModal
          teamId={teamId as string}
          refetchTeamData={refetchTeamMembers}
          isOpen={showAddMember}
          onClose={() => setShowAddMember(false)}
        />
      )}

      <TeamLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex w-full flex-col gap-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Team Members</h2>
            <Button onClick={() => setShowAddMember(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>

          <div className="space-y-4">
            {teamMembers?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.user.profilePictureUrl || ""} />
                    <AvatarFallback>
                      {member.user.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {member.user.username}
                      {teamData.leadId === member.userId && (
                        <span className="ml-2 rounded bg-primary px-2 py-1 text-xs text-primary-foreground">
                          Lead
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {member.user.email}
                    </p>
                  </div>
                </div>

                {teamData.leadId !== member.userId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveMember(member.userId)}
                    disabled={removeMember.isPending}
                  >
                    {removeMember.isPending ? (
                      <span className="flex items-center">
                        <span className="mr-2 h-4 w-4 animate-spin" />
                        Removing...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </span>
                    )}
                  </Button>
                )}
              </div>
            ))}

            {teamMembers?.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center">
                <p className="text-lg font-medium">No members yet</p>
                <p className="text-muted-foreground">
                  Add team members to collaborate on projects
                </p>
                <Button className="mt-4" onClick={() => setShowAddMember(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>
            )}
          </div>
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamMembersPage;
