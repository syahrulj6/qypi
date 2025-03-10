import { useForm } from "react-hook-form";
import {
  createEventFormSchema,
  type CreateEventFormSchema,
} from "../forms/create-event";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { EventFormInner } from "./EventFormInner";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { LoaderCircleIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateEventModal = ({
  isOpen,
  onClose,
}: CreateEventModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm<CreateEventFormSchema>({
    resolver: zodResolver(createEventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "08:00",
      endTime: "09:00",
      color: "#FFD43A",
    },
  });

  const createEvent = api.event.createEvent.useMutation();

  const handleCreateEvent = (data: CreateEventFormSchema) => {
    createEvent.mutate(
      {
        ...data,
        date: new Date(data.date),
      },
      {
        onSuccess: () => {
          toast.success("Jadwal berhasil dibuat!");
          onClose();
          form.reset();
          queryClient.invalidateQueries({ queryKey: ["getEvents"] });
        },
        onError: (err) => {
          toast.error("Gagal membuat jadwal: " + err.message);
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg border border-muted-foreground bg-card p-6 md:w-[30rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Buat Jadwal</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data dibawah untuk menambahkan jadwal
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateEvent)}
            className="mt-2 grid grid-cols-2 gap-x-2 space-y-2"
          >
            <EventFormInner />
            <Button
              type="submit"
              disabled={createEvent.isPending}
              className="col-span-2 w-full"
            >
              {createEvent.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Simpan Event"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
