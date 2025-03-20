import { Card } from "~/components/ui/card";

interface TeamMemberCardProps {
  memberId: string;
  leadId: string;
  username: string;
}

export const TeamMemberCard = ({
  leadId,
  memberId,
  username,
}: TeamMemberCardProps) => {
  return (
    <Card className="px-4 py-2">
      <div>
        {memberId === leadId ? (
          <p className="text-muted-foreground">Team Lead</p>
        ) : (
          <p className="text-muted-foreground">Team Member</p>
        )}
      </div>
      <div className="flex gap-2">
        <p>Name:</p>
        <h3 className="font-semibold">{username}</h3>
      </div>
    </Card>
  );
};
