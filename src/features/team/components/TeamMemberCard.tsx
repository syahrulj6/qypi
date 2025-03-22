import { Trash2 } from "lucide-react";
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
import { Card } from "~/components/ui/card";
import { api } from "~/utils/api";

interface TeamMemberCardProps {
  currentUserId: string;
  memberId: string;
  teamId: string;
  leadId: string;
  username: string;
  teamMemberRefetch: () => void;
  projectRefetch: () => void;
  picture: string | null;
}

export const TeamMemberCard = ({
  currentUserId,
  teamId,
  leadId,
  picture,
  memberId,
  teamMemberRefetch,
  projectRefetch,
  username,
}: TeamMemberCardProps) => {
  const deleteMember = api.team.deleteTeamMember.useMutation();

  const handleDeleteMember = () => {
    deleteMember.mutate(
      { teamId: teamId, userId: memberId },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus event!");
          teamMemberRefetch();
          projectRefetch();
        },
        onError: (err) => {
          toast.error("Gagal menghapus event: " + err.message);
        },
      },
    );
  };

  return (
    <Card className="relative flex flex-col items-center justify-center space-y-1 rounded-md bg-card p-4 md:space-y-2">
      {currentUserId === leadId && memberId !== leadId && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 text-red-500 transition-colors hover:bg-red-100 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Konfirmasi hapus member</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus member? Perubahan ini bersifat
                permanen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 transition-colors hover:bg-red-600"
                onClick={() => handleDeleteMember()}
              >
                Ya, Hapus Member
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div className="flex flex-col items-center">
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

      <Avatar className="size-8 border">
        <AvatarFallback>{picture ? "" : "U"}</AvatarFallback>
        <AvatarImage src={picture ?? ""} className="rounded-full" />
      </Avatar>

      <h3 className="text-sm font-semibold md:text-base">{username}</h3>
    </Card>
  );
};
