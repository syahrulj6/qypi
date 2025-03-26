import { Trash2 } from "lucide-react";
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
  profilePicture: string | null;
  refetch: () => void;
  router: any;
}

export const TeamCard = ({
  teamId,
  name,
  description,
  refetch,
  profilePicture,
  router,
}: TeamCardProps) => {
  const deleteTeam = api.team.deleteTeamById.useMutation();

  const handleDeleteteam = (e: React.MouseEvent) => {
    e.stopPropagation;
    deleteTeam.mutate(
      {
        teamId,
      },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus team!");
          refetch();
        },
        onError: (err) => {
          toast.error("Gagal menghapus event: " + err.message);
        },
      },
    );
  };

  return (
    <Card
      className="relative hover:cursor-pointer"
      onClick={() => {
        router.push(`/dashboard/team/${teamId}`);
      }}
    >
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
            <AlertDialogTitle>Konfirmasi hapus Team</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus team? Perubahan ini bersifat
              permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 transition-colors hover:bg-red-600"
              onClick={handleDeleteteam}
            >
              Ya, Hapus Team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
