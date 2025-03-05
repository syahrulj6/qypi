import {
  ArrowLeft,
  ChevronDown,
  CornerUpLeft,
  CornerUpRight,
  LoaderCircleIcon,
  Trash,
} from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "~/components/layout/DashboardLayout";
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
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { api } from "~/utils/api";
import { ReplyInboxModal } from "../components/ReplyInboxModal";

const InboxDetailPage = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id === undefined) return;
    if (!id) router.push("/dashboard/inbox");
  }, [id, router]);

  const { data: inboxData, isLoading } = api.inbox.getInboxById.useQuery(
    { id: id as string },
    { enabled: !!id },
  );

  const deleteInbox = api.inbox.deleteInboxById.useMutation();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mt-10 flex w-full items-center justify-center">
          <LoaderCircleIcon className="animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!inboxData) {
    return (
      <DashboardLayout>
        <div className="mt-10 text-center text-lg">Inbox not found.</div>
      </DashboardLayout>
    );
  }

  const handleDeleteInbox = () => {
    deleteInbox.mutate(
      { id: inboxData.id },
      {
        onSuccess: () => {
          router.push("/dashboard/inbox");
          toast.success("Berhasil menghapus inbox!");
        },
        onError: (error) => {
          toast.error("Gagal menghapus inbox: " + error.message);
        },
      },
    );
  };

  return (
    <DashboardLayout>
      <div className="mt-2 flex flex-col space-y-8 md:mt-4 md:pr-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button className="group" onClick={() => router.back()}>
            <ArrowLeft className="text-neutral-700 transition-colors group-hover:text-current" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" type="button">
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
                  onClick={handleDeleteInbox}
                >
                  Ya, Hapus inbox
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-10">
              <AvatarFallback>VF</AvatarFallback>
              <AvatarImage src={inboxData.sender.profilePictureUrl!} />
            </Avatar>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <p className="font-semibold">
                  {inboxData.sender.username}
                  <span className="text-muted-foreground">:</span>
                </p>
                <p className="text-muted-foreground">{inboxData.senderEmail}</p>
              </div>
              <div className="flex gap-1">
                <p className="text-muted-foreground">To me:</p>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="flex flex-col justify-center px-4 py-2">
                    <DropdownMenuItem>
                      <p className="text-muted-foreground">From:</p>
                      <p className="font-semibold">
                        {inboxData.sender.username}
                      </p>
                      <p className="text-muted-foreground">
                        {"<"}
                        {inboxData.senderEmail}
                        {">"}
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <p className="text-muted-foreground">To:</p>
                      <p className="font-semibold">{inboxData.receiverEmail}</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <p className="text-muted-foreground">Date:</p>
                      <p className="font-semibold">
                        {inboxData.createdAt.toLocaleString()}
                      </p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}

        <div className="mt-4 flex flex-col gap-4">
          <h1 className="text-xl font-bold">Message:</h1>
          <h2 className="font-semibold">{inboxData.message}</h2>

          <div className="mt-4 flex items-center gap-4 md:mt-6">
            <Button variant="outline" onClick={() => setShowModal(true)}>
              <CornerUpLeft /> Reply
            </Button>
            <Button variant="outline">
              <CornerUpRight /> Forward
            </Button>
          </div>
        </div>
      </div>
      {showModal && (
        <ReplyInboxModal
          receiverEmail={inboxData.senderEmail}
          router={router}
          inboxId={inboxData.id}
          onClose={() => setShowModal(false)}
          isOpen={showModal}
        />
      )}
    </DashboardLayout>
  );
};

export default InboxDetailPage;
