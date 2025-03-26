import { Trash2, Users } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/utils/api";

interface TeamCardProps {
  teamId: string;
  name: string;
  description: string | null;
  leadId: string;
  currentUserId?: string;
  refetch: () => void;
  router: any;
}

export const TeamCard = ({
  teamId,
  name,
  leadId,
  currentUserId,
  description,
  refetch,
  router,
}: TeamCardProps) => {
  const deleteTeam = api.team.deleteTeamById.useMutation();

  const { data: teamMembers } = api.team.getTeamMember.useQuery({
    teamId: teamId,
  });

  const isTeamLead = currentUserId === leadId;

  const handleDeleteteam = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTeam.mutate(
      { teamId },
      {
        onSuccess: () => {
          toast.success("Team deleted successfully!");
          refetch();
        },
        onError: (err) => {
          toast.error("Failed to delete team: " + err.message);
        },
      },
    );
  };

  return (
    <Card
      className="relative hover:cursor-pointer"
      onClick={() => router.push(`/dashboard/team/${teamId}`)}
    >
      {isTeamLead && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 text-red-500 transition-colors hover:bg-red-100 hover:text-red-500"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Team Deletion</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this team? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 transition-colors hover:bg-red-600"
                onClick={handleDeleteteam}
              >
                Delete Team
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-start gap-2">
        <div className="flex -space-x-2">
          {teamMembers?.map((member) => (
            <Avatar
              key={member.id}
              className="h-8 w-8 border-2 border-background"
            >
              <AvatarFallback>
                {member.user.username?.charAt(0).toUpperCase()}
              </AvatarFallback>
              <AvatarImage
                src={member.user.profilePictureUrl ?? ""}
                className="rounded-full"
              />
            </Avatar>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
};
