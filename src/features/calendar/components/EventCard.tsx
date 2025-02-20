import { Button } from "~/components/ui/button";
import { ArrowLeftFromLineIcon, LoaderCircleIcon, Trash } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
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

  useEffect(() => {
    void (async function () {
      const { data } = await supabase.auth.getUser();
      if (data.user?.id !== null) {
        setUserId(data.user!.id);
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
      {deleteEvent.isPending ? (
        <div className="flex w-full items-center justify-center">
          <LoaderCircleIcon className="animate-spin" />
        </div>
      ) : (
        <div
          className="flex h-fit flex-col rounded-lg border p-4 shadow-md"
          style={{ borderColor: event.color || "#FFD43A" }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="text-lg font-semibold"
              style={{ color: event.color || "#FFD43A" }}
            >
              {event.title}
            </h3>
            {userId === event.organizer.userId ? (
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" type="button">
                    <Trash />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi hapus event</AlertDialogTitle>
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
            ) : (
              <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" type="button">
                    <ArrowLeftFromLineIcon />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tinggalkan Event ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Apakah Anda yakin ingin meninggalkan event? Perubahan ini
                      bersifat permanen.
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
            )}
          </div>
          <p
            className="text-sm text-muted-foreground"
            style={{ color: event.color || "#FFD43A" }}
          >
            {new Date(event.date).toLocaleDateString()}
          </p>
          <p className={`text-sm`} style={{ color: event.color || "#FFD43A" }}>
            {event.startTime} - {event.endTime}
          </p>
          {event.participants.length > 0 && (
            <div className="mt-3">
              <div className="mt-1 flex items-center gap-1">
                {event.participants.map((participant) => (
                  <Avatar className="size-8" key={participant.userId}>
                    <AvatarFallback>VF</AvatarFallback>
                    <AvatarImage
                      src={participant.profilePicture}
                      className="rounded-full"
                    />
                  </Avatar>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
