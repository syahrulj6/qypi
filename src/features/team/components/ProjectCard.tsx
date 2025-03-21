import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string | null;
  endDate: Date;
  router: any;
  team: {
    lead?: {
      profilePictureUrl?: string | null;
    };
    members?: {
      user?: {
        profilePictureUrl?: string | null;
      };
    }[];
  };
}

export const ProjectCard = ({
  id,
  team,
  endDate,
  name,
  description,
  router,
}: ProjectCardProps) => {
  const leadProfilePicture = team.lead?.profilePictureUrl;

  const memberProfilePictures =
    team.members
      ?.filter(
        (member) => member.user?.profilePictureUrl !== leadProfilePicture,
      )
      .map((member) => member.user?.profilePictureUrl) || [];

  const profilePictures = [leadProfilePicture, ...memberProfilePictures].filter(
    Boolean,
  );

  return (
    <Card
      className="hover:cursor-pointer"
      onClick={() => router.push(`/dashboard/team/[id]/${id}`)}
    >
      <CardHeader>
        <CardTitle>Project end in</CardTitle>
        <CardDescription>{endDate.toDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <p className="text-muted-foreground">Project name:</p>
          <p className="font-semibold">{name}</p>
          <p className="text-muted-foreground">Project Description:</p>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        {profilePictures.map((picture, index) => (
          <Avatar key={index} className="size-8">
            <AvatarFallback>{picture ? "" : "U"}</AvatarFallback>
            <AvatarImage src={picture ?? ""} className="rounded-full" />
          </Avatar>
        ))}
      </CardFooter>
    </Card>
  );
};
