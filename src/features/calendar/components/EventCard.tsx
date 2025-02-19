import { Button } from "~/components/ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner";
import { api } from "~/utils/api";
import { useForm } from "react-hook-form";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    date: Date;
    startTime: string;
    endTime: string;
    color?: string;
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
    </div>
  );
};
