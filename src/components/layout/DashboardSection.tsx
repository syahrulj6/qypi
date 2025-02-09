import { api } from "~/utils/api";
import { ProfileDropdown } from "./ProfileDropdown";
import { useSession } from "~/hooks/useSession";
import Link from "next/link";
import {
  Bell,
  Calendar as CalendarIcon,
  MessageSquareMore,
} from "lucide-react";
import { useState, useRef } from "react";
import { Calendar } from "~/components/ui/calendar";
import { useOutsideClick } from "~/hooks/useOutsideClick";

type NotificationsType = {
  id: string;
  title: string;
  from: string;
  date: Date;
  link: string;
};
// Inbox Dummy
const notifications: NotificationsType[] = [
  {
    id: "1",
    from: "farelrudi",
    title: "Hello Jayy! How are u?",
    date: new Date(),
    link: "/dashboard/inbox",
  },
  {
    id: "2",
    from: "farelrudi",
    title: "Eh bang windah up video baru cuy!",
    date: new Date(),
    link: "/dashboard/inbox",
  },
  {
    id: "3",
    from: "farelrudi",
    title: "Eh marapthon ngundang bintang tamu 5 kage cuy!",
    date: new Date(),
    link: "/dashboard/inbox",
  },
];

const NotificationsDropdown = ({
  showNotifications,
  setShowNotifications,
}: {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}) => {
  const notificationsRef = useRef<HTMLDivElement>(null);
  useOutsideClick(notificationsRef, () => setShowNotifications(false));

  return (
    showNotifications && (
      <div className="absolute right-0 top-8 z-10 flex w-2/4 flex-col gap-1 rounded-md border bg-secondary">
        {notifications.map((notif) => (
          <div
            ref={notificationsRef}
            key={notif.id}
            className="rounded-md border-b px-2 py-1 transition-colors hover:bg-blue-600"
          >
            <Link href={notif.link}>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">From: </span>
                <p className="font-medium text-primary">{notif.from}</p>
              </div>
              <p className="text-sm text-muted-foreground">message:</p>
              <p className="tracking-tight text-muted-foreground">
                {notif.title}
              </p>
            </Link>
          </div>
        ))}
      </div>
    )
  );
};

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
  const [showNotifications, setShowNotifications] = useState(false);

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
        <div className="relative mr-8 flex w-2/3 items-center justify-end gap-5">
          <ProfileDropdown handleSignOut={handleSignOut} session={session} />
          <button onClick={() => setShowCalendar((prev) => !prev)}>
            <CalendarIcon className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </button>
          <button onClick={() => setShowNotifications((prev) => !prev)}>
            <Bell className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </button>

          <CalendarDropdown
            date={date}
            setDate={setDate}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
          />

          <NotificationsDropdown
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />
        </div>
      </div>
      {children}
    </section>
  );
};
