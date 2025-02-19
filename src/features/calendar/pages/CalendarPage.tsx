import React, { useEffect, useState } from "react";
import { CalendarHeader } from "../components/CalendarHeader";
import { Button } from "~/components/ui/button";
import { Edit, Plus, Trash, X } from "lucide-react";
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
import { DatePicker } from "../components/DatePickerModal";
import { CreateEventModal } from "../components/CreateEventModal";

const CalendarPage = () => {
  const {
    data: getEventsData,
    isLoading,
    refetch,
  } = api.event.getEvents.useQuery();
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "yearly">(
    "weekly",
  );
  const [showCalendar, setShowCalendar] = useState(false);

  const [date, setDate] = useState<Date | undefined>(new Date());

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
    const selectedDate = date ? new Date(date) : new Date();
    const startDate = new Date(selectedDate);
    const endDate = new Date(selectedDate);

    if (activeTab === "weekly") {
      endDate.setDate(endDate.getDate() + 7);
    } else if (activeTab === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (activeTab === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    return eventDate >= startDate && eventDate <= endDate;
  });

  const deleteEvent = api.event.deleteEventById.useMutation();

  useEffect(() => {
    if (!isLoading) {
      refetch();
    }
  }, [isLoading, showModal, refetch, date]);

  return (
    <SessionRoute>
      <DashboardLayout>
        <div className="flex flex-1 flex-col pr-0 md:pr-8">
          <CalendarHeader activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-2 flex items-center justify-between border-b border-muted-foreground py-4 md:mt-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h2 className="text-md font-bold md:text-xl">
                  {date?.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                  })}
                </h2>
                <button
                  className="rounded-md p-2 transition-colors hover:bg-purple-300 hover:text-primary"
                  onClick={() => setShowCalendar((prev) => !prev)}
                >
                  <Edit className="h-5 w-5" />
                </button>
              </div>
              <p className="text-md text-muted-foreground md:text-base">
                {date?.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                -{" "}
                {date
                  ? new Date(
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
                    })
                  : "Pilih tanggal"}
              </p>
            </div>
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
                            form.reset();
                            refetch();
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
            <CreateEventModal
              isOpen={showModal}
              onClose={() => setShowModal(false)}
            />
          )}
        </div>
        {showCalendar && (
          <DatePicker
            onSelect={setDate}
            selected={date}
            setShowCalendar={setShowCalendar}
          />
        )}
      </DashboardLayout>
    </SessionRoute>
  );
};

export default CalendarPage;
