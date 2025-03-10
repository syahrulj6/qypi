import { useForm } from "react-hook-form";
import {
  updateEventSchema,
  type UpdateEventSchema,
} from "../forms/update-event";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { EventFormInner } from "./EventFormInner";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { LoaderCircleIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";

interface UpdateEventModal {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const UpdateEventModal = ({
  isOpen,
  onClose,
  eventId,
  refetch,
}: UpdateEventModal) => {
  const { data: getEventData } = api.event.getEventById.useQuery({
    eventId,
  });

  const form = useForm<UpdateEventSchema>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      startTime: "",
      endTime: "",
      color: "",
    },
  });

  useEffect(() => {
    if (getEventData) {
      const formatTime = (dateString: Date) => {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      };

      form.reset({
        title: getEventData.title,
        color: getEventData.color ?? "",
        date: new Date(getEventData.date),
        description: getEventData.description ?? "",
        startTime: getEventData.startTime
          ? formatTime(getEventData.startTime)
          : "",
        endTime: getEventData.endTime ? formatTime(getEventData.endTime) : "",
      });
    }
  }, [getEventData, form]);

  const updateEvent = api.event.updateEvent.useMutation();

  const handleUpdateEvent = (data: UpdateEventSchema) => {
    updateEvent.mutate(
      {
        eventId,
        ...data,
        date: new Date(data.date),
      },
      {
        onSuccess: () => {
          toast.success("Berhasil update event!");
          refetch();
          onClose();
        },
        onError: () => {
          toast.error("Gagal update event!");
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null; // Prevent rendering if modal is not open

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg border border-muted-foreground bg-card p-6 md:w-[30rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Update Jadwal</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data di bawah untuk mengupdate jadwal
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateEvent)}
            className="mt-2 grid grid-cols-2 gap-x-2 space-y-2"
          >
            <EventFormInner />
            <Button
              type="submit"
              disabled={updateEvent.isPending}
              className="col-span-2 w-full"
            >
              {updateEvent.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Simpan Note"
              )}{" "}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
