import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface TeamCardProps {
  teamId: string;
  name: string;
  description: string | null;
  profilePicture: string | null;
  router: any;
}

export const TeamCard = ({
  teamId,
  name,
  description,
  profilePicture,
  router,
}: TeamCardProps) => {
  return (
    <Card
      className="hover:cursor-pointer"
      onClick={() => {
        router.push(`/dashboard/team/${teamId}`);
        console.log(
          "Team card clicked, redirecting to:",
          `/dashboard/team/${teamId}`,
        );
      }}
    >
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Avatar className="size-8">
          <AvatarFallback>VF</AvatarFallback>
          <AvatarImage src={profilePicture ?? ""} className="rounded-full" />
        </Avatar>
      </CardFooter>
    </Card>
  );
};
