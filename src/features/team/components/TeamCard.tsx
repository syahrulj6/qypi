import React from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
  currentUserId?: string;
  refetch: () => void;
  router: any;
}

export const TeamCard = ({
  teamId,
  name,
  description,
  router,
}: TeamCardProps) => {
  const { data: teamMembers } = api.team.getTeamMember.useQuery({
    teamId: teamId,
  });

  return (
    <Card
      className="relative flex flex-col justify-between hover:cursor-pointer"
      onClick={() => router.push(`/dashboard/team/${teamId}`)}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-start justify-between gap-2">
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
