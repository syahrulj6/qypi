import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface TeamCardProps {
  id: string;
  name: string;
  description: string | null;
  profilePicture: string | null;
  router: any;
}

export const TeamCard = ({
  id,
  name,
  description,
  profilePicture,
  router,
}: TeamCardProps) => {
  return (
    <Card
      className="hover:cursor-pointer"
      onClick={() => router.push(`/dashboard/team/${id}`)}
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
