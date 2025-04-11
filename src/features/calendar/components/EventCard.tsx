import { Button } from "~/components/ui/button";
import {
  ArrowLeftFromLineIcon,
  Edit2,
  LoaderCircleIcon,
  Trash,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "~/utils/api";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
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
import { useEffect, useState } from "react";
import { supabase } from "~/lib/supabase/client";
import { UpdateEventModal } from "./UpdateEventModal";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    color?: string;
    participants: {
      userId: string;
      email: string;
      username?: string;
      profilePicture?: string;
    }[];
    organizer: {
      userId: string;
      email: string;
      username?: string;
      profilePicture?: string;
    };
  };
  refetch: () => void;
}

export const EventCard = ({ event, refetch }: EventCardProps) => {
  const [userId, setUserId] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  useEffect(() => {
    void (async function () {
      const { data } = await supabase.auth.getUser();
      if (data.user?.id) {
        setUserId(data.user.id);
      }
    })();
  }, []);

  const deleteEvent = api.event.deleteEventById.useMutation();
  const leaveEvent = api.event.leaveEvent.useMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteEvent.mutate(
      { eventId: event.id },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus event!");
          refetch();
        },
        onError: (err) => {
          toast.error("Gagal menghapus event: " + err.message);
        },
      },
    );
  };

  const handleLeaveEvent = () => {
    leaveEvent.mutate(
      {
        eventId: event.id,
      },
      {
        onSuccess: () => {
          toast.success("Berhasil meninggalkan event");
          refetch();
        },
        onError: (err) => {
          toast.error("Gagal Meninggalkan event: " + err.message);
        },
      },
    );
  };

  return (
    <>
      {deleteEvent.isPending || leaveEvent.isPending ? (
        <div className="flex w-full items-center justify-center py-4">
          <LoaderCircleIcon className="size-6 animate-spin" />
        </div>
      ) : (
        <div
          className="flex h-fit w-full flex-col rounded-lg border p-4 shadow-md sm:w-auto"
          style={{ borderColor: event.color || "#FFD43A" }}
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <h3
                className="truncate text-lg font-semibold"
                style={{ color: event.color || "#FFD43A" }}
                title={event.title}
              >
                {event.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <p
                  className="text-muted-foreground"
                  style={{ color: event.color || "#FFD43A" }}
                >
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <span className="text-muted-foreground">•</span>
                <p style={{ color: event.color || "#FFD43A" }}>
                  {event.startTime} - {event.endTime}
                </p>
              </div>
            </div>

            {userId === event.organizer.userId ? (
              <div className="flex items-center justify-end gap-1 sm:justify-start">
                <Button
                  onClick={() => setShowUpdateModal(true)}
                  size="sm"
                  className="size-8"
                >
                  <Edit2 />
                </Button>
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      type="button"
                      className="size-8 p-0"
                    >
                      <Trash className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Konfirmasi hapus event
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus event? Perubahan ini
                        bersifat permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 transition-colors hover:bg-red-600"
                        onClick={() => {
                          setIsDialogOpen(false);
                          handleDelete();
                        }}
                      >
                        Ya, Hapus Event
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div className="flex justify-end sm:justify-start">
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="size-8 p-0 text-destructive hover:text-destructive"
                    >
                      <ArrowLeftFromLineIcon className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tinggalkan Event ini?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin meninggalkan event? Perubahan
                        ini bersifat permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 transition-colors hover:bg-red-600"
                        onClick={() => {
                          setIsDialogOpen(false);
                          handleLeaveEvent();
                        }}
                      >
                        Ya, Tinggalkan Event
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {(event.participants.length > 0 ||
            userId === event.organizer.userId) && (
            <div className="mt-3 flex items-center justify-between">
              {event.participants.length > 0 && (
                <div className="flex -space-x-2 overflow-hidden">
                  {event.participants.slice(0, 5).map((participant) => (
                    <Avatar className="size-8" key={participant.userId}>
                      <AvatarFallback className="text-xs">
                        {participant.username?.charAt(0).toUpperCase() ||
                          participant.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                      <AvatarImage
                        src={participant.profilePicture}
                        className="rounded-full border-2 border-background"
                      />
                    </Avatar>
                  ))}
                  {event.participants.length > 5 && (
                    <div className="flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                      +{event.participants.length - 5}
                    </div>
                  )}
                </div>
              )}

              {userId === event.organizer.userId && (
                <div className="text-xs text-muted-foreground">Organizer</div>
              )}
            </div>
          )}
        </div>
      )}

      {showUpdateModal && (
        <UpdateEventModal
          refetch={refetch}
          eventId={event.id}
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </>
  );
};
