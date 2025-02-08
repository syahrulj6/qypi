import { api } from "~/utils/api";
import { ProfileDropdown } from "./ProfileDropdown";
import { useSession } from "~/hooks/useSession";
import Link from "next/link";
import {
  Bell,
  Calendar as CalendarIcon,
  MessageSquareMore,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Calendar } from "~/components/ui/calendar";
import { useOutsideClick } from "~/hooks/useOutsideClick";

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

export const DashboardSection = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const { session, handleSignOut } = useSession();

  const { data: getProfileData } = api.profile.getProfile.useQuery(undefined, {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });

  return (
    <section className="flex w-full flex-col p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">
          Good morning, {getProfileData?.username}!
        </h1>
        <div className="relative mr-8 flex items-center gap-5">
          <button onClick={() => setShowCalendar((prev) => !prev)}>
            <CalendarIcon className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </button>
          <Link href="/dashboard/inbox">
            <MessageSquareMore className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <button>
            <Bell className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </button>

          <ProfileDropdown handleSignOut={handleSignOut} session={session} />

          <CalendarDropdown
            date={date}
            setDate={setDate}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
          />
        </div>
      </div>
      {children}
    </section>
  );
};
