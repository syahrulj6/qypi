import { Button } from "~/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

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
  };
  refetch: () => void;
}

export const EventCard = ({ event, refetch }: EventCardProps) => {
  const deleteEvent = api.event.deleteEventById.useMutation();
  const form = useForm();

  const handleDelete = () => {
    deleteEvent.mutate(
      { eventId: event.id },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus event!");
          form.reset();
          refetch();
        },
        onError: (err) => {
          toast.error("Gagal menghapus event: " + err.message);
        },
      },
    );
  };

  return (
    <div className="flex flex-col rounded-lg border border-gray-300 p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <Button variant="destructive" size="icon" onClick={handleDelete}>
          <Trash />
        </Button>
      </div>
      <p className="text-sm text-gray-600">
        {new Date(event.date).toLocaleDateString()}
      </p>
      <p className="text-sm">
        {event.startTime} - {event.endTime}
      </p>
      <div
        className="mt-2 h-2 w-full rounded"
        style={{ backgroundColor: event.color || "#FFD43A" }}
      />
      {event.participants.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium">Participants:</p>
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
  );
};
