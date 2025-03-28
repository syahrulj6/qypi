import { useRouter } from "next/router";
import { useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import TeamLayout from "../components/TeamLayout";
import { Button } from "~/components/ui/button";
import { Trash2, Pencil, UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { AddTeamMemberModal } from "../components/AddTeamMemberModal";

const TeamSettingsPage = () => {
  const router = useRouter();
  const { teamId } = router.query;

  const [showAddMember, setShowAddMember] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

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
    refetch: refetchTeamMember,
  } = api.team.getTeamMember.useQuery(
    { teamId: teamId as string },
    { enabled: !!teamId },
  );

  const updateTeam = api.team.updateTeam.useMutation();
  const deleteTeam = api.team.deleteTeamById.useMutation();
  const removeMember = api.team.deleteTeamMember.useMutation();

  const handleUpdateTeam = async () => {
    try {
      await updateTeam.mutateAsync({
        teamId: teamId as string,
        name: teamName,
        description: teamDescription,
      });
      toast.success("Team updated successfully");
    } catch (error) {
      toast.error("Failed to update team");
    }
  };

  const handleDeleteTeam = async () => {
    if (deleteConfirmation !== teamData?.name) {
      toast.error(
        "Team name does not match. Please type the team name exactly to confirm deletion",
      );
      return;
    }

    try {
      await deleteTeam.mutateAsync({
        teamId: teamId as string,
        name: teamData?.name || "",
      });
      toast.success("Team deleted successfully");
      router.push("/dashboard/team");
    } catch (error) {
      toast.error("Failed to delete team");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    try {
      await removeMember.mutateAsync({
        teamId: teamId as string,
        userId,
      });
      toast.success("Member removed successfully");
      refetchTeamMember();
    } catch (error) {
      toast.error("Failed to remove member");
    }
  };

  if (teamLoading || membersLoading) {
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
    { label: "Settings" },
  ];

  return (
    <DashboardLayout>
      {showAddMember && (
        <AddTeamMemberModal
          teamId={teamId as string}
          refetchTeamData={refetchTeamMember}
          isOpen={showAddMember}
          onClose={() => setShowAddMember(false)}
        />
      )}

      <TeamLayout breadcrumbItems={breadcrumbItems}>
        <div className="flex w-full flex-col gap-8">
          {/* General Settings */}
          <div className="rounded-lg border p-6">
            <h2 className="mb-6 text-lg font-semibold">General Settings</h2>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  defaultValue={teamData.name}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="team-description">Team Description</Label>
                <Textarea
                  id="team-description"
                  defaultValue={teamData.description || ""}
                  onChange={(e) => setTeamDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleUpdateTeam}
                  disabled={updateTeam.isPending}
                >
                  {updateTeam.isPending ? (
                    <Pencil className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Pencil className="mr-2 h-4 w-4" />
                      Update Team
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="rounded-lg border p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Team Members</h2>
              <Button onClick={() => setShowAddMember(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>

            <div className="space-y-4">
              {teamMembers?.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded border p-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={member.user.profilePictureUrl || ""} />
                      <AvatarFallback>
                        {member.user.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.user.username}</p>
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
                      {removeMember.isPending ? "Removing..." : "Remove"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-lg border border-red-500 p-6">
            <h2 className="mb-6 text-lg font-semibold text-red-500">
              Danger Zone
            </h2>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    the team and all its data.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="delete-confirmation">
                      Type <span className="font-bold">{teamData.name}</span> to
                      confirm
                    </Label>
                    <Input
                      id="delete-confirmation"
                      value={deleteConfirmation}
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteTeam}
                    disabled={
                      deleteConfirmation !== teamData.name ||
                      deleteTeam.isPending
                    }
                  >
                    {deleteTeam.isPending ? (
                      <Trash2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Delete Team"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamSettingsPage;
