import React, { useEffect, useState } from "react";
import { CalendarHeader } from "../components/CalendarHeader";
import { Button } from "~/components/ui/button";
import { Plus, Trash, X } from "lucide-react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { api } from "~/utils/api";
import { eventFormSchema, type EventFormSchema } from "../forms/event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { EventFormInner } from "../components/EventFormInner";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const CalendarPage = () => {
  const queryClient = useQueryClient();
  const {
    data: getEventsData,
    isLoading,
    refetch,
  } = api.event.getEvents.useQuery();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "yearly">(
    "weekly",
  );

  const date = new Date();

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "08:00",
      endTime: "09:00",
      color: "#FFD43A",
    },
  });

  const filteredEvents = getEventsData?.filter((event) => {
    const eventDate = new Date(event.date);
    const today = new Date();

    if (activeTab === "weekly") {
      return (
        eventDate >= today &&
        eventDate <= new Date(today.setDate(today.getDate() + 7))
      );
    } else if (activeTab === "monthly") {
      return (
        eventDate >= today &&
        eventDate <= new Date(today.setMonth(today.getMonth() + 1))
      );
    } else if (activeTab === "yearly") {
      return (
        eventDate >= today &&
        eventDate <= new Date(today.setFullYear(today.getFullYear() + 1))
      );
    }
    return false;
  });

  const createEvent = api.event.createEvent.useMutation();
  const deleteEvent = api.event.deleteEventById.useMutation();

  useEffect(() => {
    if (!isLoading) {
      refetch();
    }
  }, [isLoading, showModal, refetch]);

  return (
    <SessionRoute>
      <DashboardLayout>
        <div className="flex flex-1 flex-col pr-0 md:pr-8">
          <CalendarHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-2 flex items-center justify-between border-b border-muted-foreground py-4 md:mt-3">
            <h2 className="text-lg font-bold md:text-xl">
              {date.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(
                date.getTime() +
                  (activeTab === "weekly"
                    ? 7
                    : activeTab === "monthly"
                      ? 30
                      : 365) *
                    24 *
                    60 *
                    60 *
                    1000,
              ).toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h2>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="mr-2" /> Buat Jadwal
            </Button>
          </div>

          {isLoading && (
            <div className="mt-4 flex h-full w-full items-center justify-center">
              Loading...
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents?.map((event) => (
              <div
                key={event.id}
                className="flex flex-col rounded-lg border border-gray-300 p-4 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() =>
                      deleteEvent.mutate(
                        { eventId: event.id },
                        {
                          onSuccess: () => {
                            toast.success("Berhasil menghapus event!");
                            setShowModal(false);
                            form.reset();
                            queryClient.invalidateQueries({
                              queryKey: ["getEvents"],
                            });
                          },
                          onError: (err) => {
                            toast.error(
                              "Gagal menghapus event: " + err.message,
                            );
                          },
                        },
                      )
                    }
                  >
                    <Trash />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  {new Date(event.date).toDateString()}
                </p>
                <p className="text-sm">
                  {event.startTime.toLocaleDateString()} -{" "}
                  {event.endTime.toLocaleDateString()}
                </p>
                <div
                  className="mt-2 h-2 w-full rounded"
                  style={{ backgroundColor: event.color || "#FFD43A" }}
                />
              </div>
            ))}
          </div>

          {showModal && (
            <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
              <div className="w-96 rounded-lg border border-muted-foreground bg-white p-6 md:w-[30rem]">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h2 className="text-xl font-semibold">Buat Jadwal</h2>
                    <p className="text-sm text-muted-foreground md:text-base">
                      Isi data dibawah untuk menambahkan jadwal
                    </p>
                  </div>
                  <button onClick={() => setShowModal(false)}>
                    <X />
                  </button>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => {
                      createEvent.mutate(
                        {
                          ...data,
                          date: new Date(data.date),
                        },
                        {
                          onSuccess: () => {
                            toast.success("Jadwal berhasil dibuat!");
                            setShowModal(false);
                            form.reset();
                            queryClient.invalidateQueries({
                              queryKey: ["getEvents"],
                            });
                          },
                          onError: (err) => {
                            toast.error("Gagal membuat jadwal: " + err.message);
                          },
                        },
                      );
                    })}
                    className="mt-4 grid grid-cols-2 gap-x-2 space-y-4"
                  >
                    <EventFormInner />
                    <Button type="submit" className="col-span-2 w-full">
                      Simpan Jadwal
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default CalendarPage;
