import { Trash } from "lucide-react";
import { useRouter } from "next/router";
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
import { api } from "~/utils/api";

interface Message {
  id: string;
  subject: string;
  message: string;
  senderEmail: string;
  senderProfilePicture: string;
  createdAt: string;
  receiverEmail: string;
  parentId: string;
  isRead: boolean;
  onMarkAsRead: () => void;
  refetch: () => void;
}

export const InboxCard = ({
  id,
  createdAt,
  refetch,
  message,
  subject,
  senderEmail,
  senderProfilePicture,
  parentId,
  isRead,
  onMarkAsRead,
}: Message) => {
  const router = useRouter();

  const handleMarkAsRead = () => {
    if (!isRead) {
      onMarkAsRead();
    }
    router.push(`/dashboard/inbox/${id}`);
  };

  const deleteInbox = api.inbox.deleteInboxById.useMutation();
  const handleDeleteInbox = () => {
    deleteInbox.mutate(
      { id },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus inbox!");
          refetch();
        },
        onError: (error) => {
          toast.error("Gagal menghapus inbox: " + error.message);
        },
      },
    );
  };
  return (
    <div
      onClick={handleMarkAsRead}
      className={`flex flex-col space-y-2 rounded-lg border px-4 py-2 hover:cursor-pointer ${isRead && "opacity-65"} `}
    >
      {parentId && (
        <div className="flex gap-2">
          <p className="font-semibold">{senderEmail}</p>
          <p className="text-muted-foreground">Replies your inbox</p>
        </div>
      )}
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-10">
            <AvatarFallback>VF</AvatarFallback>
            <AvatarImage src={senderProfilePicture} />
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold">{senderEmail}</p>
            <div className="flex gap-2">
              <p className="font-medium">{subject} - </p>
              <p className="text-muted-foreground">{message}</p>
            </div>
          </div>
        </div>

        <div className="z-10 flex gap-4 pt-2">
          <p className="text-sm text-muted-foreground">
            {new Date(createdAt).toLocaleString()}
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                onClick={(e) => e.stopPropagation()}
                variant="destructive"
                type="button"
                className="h-7 w-7"
              >
                <Trash />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi hapus inbox</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus inbox? Perubahan ini
                  bersifat permanen.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 transition-colors hover:bg-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteInbox();
                  }}
                >
                  Ya, Hapus inbox
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};
