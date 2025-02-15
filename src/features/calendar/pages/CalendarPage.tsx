import React, { useRef, useState } from "react";
import { CalendarHeader } from "../components/CalendarHeader";
import { Button } from "~/components/ui/button";
import { Edit, Plus, X } from "lucide-react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { useOutsideClick } from "~/hooks/useOutsideClick";
import { Calendar } from "~/components/ui/calendar";

const CalendarDropdown = ({
  date,
  setDate,
  showCalendar,
  setShowCalendar,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
}) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  useOutsideClick(calendarRef, () => setShowCalendar(false));

  return (
    showCalendar && (
      <div
        ref={calendarRef}
        className="absolute right-0 top-8 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            setDate(selectedDate);
            setTimeout(() => setShowCalendar(true));
          }}
          className="rounded-md border shadow"
        />
      </div>
    )
  );
};

const events = [
  {
    id: 1,
    title: "Meeting With Marc",
    time: "11:30 AM - 12:30 PM",
    date: "Monday 15",
    color: "bg-red-100 border-red-500 text-red-700",
  },
  {
    id: 2,
    title: "Finishing Web AI",
    time: "08:30 AM - 10:00 AM",
    date: "Tuesday 16",
    color: "bg-blue-100 border-blue-500 text-blue-700",
  },
  {
    id: 3,
    title: "Session Photoshoot",
    time: "10:00 AM - 11:30 AM",
    date: "Tuesday 16",
    color: "bg-yellow-100 border-yellow-500 text-yellow-700",
  },
];

const CalendarPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
    });
  };

  return (
    <SessionRoute>
      <DashboardLayout>
        <div className="flex flex-1 flex-col pr-0 md:pr-8">
          <CalendarHeader />
          <div className="flex items-center justify-between py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <h2 className="text-md font-bold md:text-xl">
                  {formatDate(date)}
                </h2>
                <button className="rounded-md p-2 transition-colors hover:bg-purple-300 hover:text-primary">
                  <Edit className="h-5 w-5" />
                </button>
              </div>
            </div>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="mr-2" /> Create Schedule
            </Button>
          </div>
          <div className="grid grid-cols-7 gap-2 border-t py-2 text-center">
            {[
              "Sunday 14",
              "Monday 15",
              "Tuesday 16",
              "Wednesday 17",
              "Thursday 18",
              "Friday 19",
              "Saturday 20",
            ].map((day) => (
              <div key={day} className="p-2 font-medium text-gray-700">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 border-t py-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={`rounded-lg border p-3 shadow-md ${event.color}`}
              >
                <h3 className="text-sm font-semibold">{event.title}</h3>
                <p className="text-xs">{event.time}</p>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Create Schedule</h2>
                <button onClick={() => setShowModal(false)}>
                  <X />
                </button>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded border p-2"
                  placeholder="Enter event title"
                />
                <label className="mt-4 block text-sm font-medium">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded border p-2"
                />
              </div>
              <Button className="mt-4 w-full">Save Event</Button>
            </div>
          </div>
        )}
      </DashboardLayout>
    </SessionRoute>
  );
};

export default CalendarPage;
