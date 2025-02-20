import React, { useEffect, useState } from "react";
import { CalendarHeader } from "../components/CalendarHeader";
import { Button } from "~/components/ui/button";
import { Edit, LoaderCircleIcon, Plus } from "lucide-react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { api } from "~/utils/api";
import { DatePicker } from "../components/DatePickerModal";
import { CreateEventModal } from "../components/CreateEventModal";
import { EventCard } from "../components/EventCard";

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
              <LoaderCircleIcon className="animate-spin" />
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {/* TODO: Event UI */}
            {filteredEvents?.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  id: event.id,
                  title: event.title,
                  date: new Date(event.date),
                  startTime: new Date(event.startTime).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "numeric",
                      minute: "2-digit",
                    },
                  ),
                  endTime: new Date(event.endTime).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  }),
                  color: event.color || "#FFD43A",
                  participants: event.participants.map((p) => ({
                    userId: p.user.userId,
                    email: p.user.email,
                    username: p.user.username,
                    profilePicture: p.user.profilePictureUrl || "",
                  })),
                }}
                refetch={refetch}
              />
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
