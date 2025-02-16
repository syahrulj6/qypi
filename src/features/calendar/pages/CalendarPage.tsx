import React, { useEffect, useState } from "react";
import { CalendarHeader } from "../components/CalendarHeader";
import { Button } from "~/components/ui/button";
import { Plus, X } from "lucide-react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { api } from "~/utils/api";
import { eventFormSchema, type EventFormSchema } from "../forms/event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { EventFormInner } from "../components/EventFormInner";
import { toast } from "sonner";
import { TRPCClientError } from "@trpc/client";

const CalendarPage = () => {
  const { data: getEventsData, isLoading } = api.event.getEvents.useQuery();
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date().toISOString(),
      startTime: "08:00",
      endTime: "09:00",
      color: "#f02f22",
    },
  });

  useEffect(() => {
    if (getEventsData?.length) {
      const event = getEventsData[0];
      form.reset({
        title: event?.title || "",
        description: event?.description || "",
        date: event?.date
          ? new Date(event.date).toISOString()
          : new Date().toISOString(),
        startTime:
          typeof event?.startTime === "string" ? event.startTime : "08:00",
        endTime: typeof event?.endTime === "string" ? event.endTime : "09:00",
        color: event?.color || "#f02f22",
      });
    }
  }, [getEventsData, form]);

  const createEvent = api.event.createEvent.useMutation({
    onSuccess: () => {
      toast.success("Event successfully created!");
      setShowModal(false);
    },
    onError: (err) => {
      if (err instanceof TRPCClientError) {
        toast.error("Failed to create event: " + err.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    },
  });

  const onSubmit = (values: EventFormSchema) => {
    try {
      const selectedDate = new Date(values.date);

      const [startHours, startMinutes] = values.startTime
        .split(":")
        .map(Number);
      const [endHours, endMinutes] = values.endTime.split(":").map(Number);

      const startDateTime = new Date(selectedDate);
      startDateTime.setHours(startHours!, startMinutes, 0, 0);

      const endDateTime = new Date(selectedDate);
      endDateTime.setHours(endHours!, endMinutes, 0, 0);

      createEvent.mutate({
        title: values.title,
        description: values.description,
        date: selectedDate, // Ensure this is a Date object, not a string
        startTime: values.startTime, // Keep as "HH:mm"
        endTime: values.endTime, // Keep as "HH:mm"
        color: values.color,
      });

      toast.success("Event created successfully!");
    } catch (error) {
      toast.error("Failed to create event.");
      console.error(error);
    }
  };

  return (
    <SessionRoute>
      <DashboardLayout>
        <div className="flex flex-1 flex-col pr-0 md:pr-8">
          <CalendarHeader />
          <div className="flex items-center justify-between py-4">
            <h2 className="text-md font-bold md:text-xl">
              {date?.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
              })}
            </h2>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="mr-2" /> Create Schedule
            </Button>
          </div>
          {isLoading && (
            <div className="flex h-full w-full items-center justify-center">
              Loading...
            </div>
          )}
          {!isLoading &&
            getEventsData?.map((event) => (
              <div className="" key={event.id}>
                {event.title}
              </div>
            ))}
          <div className=""></div>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="w-96 rounded-lg border border-muted-foreground bg-card p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Create Schedule</h2>
                  <button onClick={() => setShowModal(false)}>
                    <X />
                  </button>
                </div>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-4 space-y-4"
                  >
                    <EventFormInner />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createEvent.isPending}
                    >
                      {createEvent.isPending ? "Saving..." : "Save Event"}
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
