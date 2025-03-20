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
    <Card className="space-y-1 rounded-md px-4 py-2 md:space-y-2">
      <div>
        {memberId === leadId ? (
          <p className="text-sm text-muted-foreground md:text-base">
            Team Lead
          </p>
        ) : (
          <p className="text-sm text-muted-foreground md:text-base">
            Team Member
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <p className="text-sm md:text-base">Name:</p>
        <h3 className="text-sm font-semibold md:text-base">{username}</h3>
      </div>
    </Card>
  );
};
