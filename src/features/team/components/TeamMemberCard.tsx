import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface TeamMemberCardProps {
  memberId: string;
  leadId: string;
  username: string;
  picture: string | null;
}

export const TeamMemberCard = ({
  leadId,
  picture,
  memberId,
  username,
}: TeamMemberCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-1 rounded-md bg-card md:space-y-2">
      <>
        {memberId === leadId ? (
          <p className="text-center text-sm text-muted-foreground md:text-base">
            Team Lead
          </p>
        ) : (
          <p className="text-sm text-muted-foreground md:text-base">
            Team Member
          </p>
        )}
      </>
      <Avatar className="size-8">
        <AvatarFallback>{picture ? "" : "U"}</AvatarFallback>
        <AvatarImage src={picture ?? ""} className="rounded-full" />
      </Avatar>

      <h3 className="text-sm font-semibold md:text-base">{username}</h3>
    </div>
  );
};
