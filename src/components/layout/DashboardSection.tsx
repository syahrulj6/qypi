import { ProfileDropdown } from "./ProfileDropdown";
import { useSession } from "~/hooks/useSession";
import { Bell, Calendar as CalendarIcon } from "lucide-react";
import { useState, useRef } from "react";
import { Calendar } from "~/components/ui/calendar";
import { useOutsideClick } from "~/hooks/useOutsideClick";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { NotificationsDropdown } from "./NotificationsDropdown";

const menuItems = [
  { title: "Profile", url: "/profile" },
  { title: "", url: "/dashboard" },
  { title: "My Inbox", url: "/dashboard/inbox" },
  { title: "My Calendar", url: "/dashboard/calendar" },
  { title: "My Notes", url: "/dashboard/notes" },
  { title: "Settings", url: "/dashboard/settings" },
  { title: "Workspace", url: "/dashboard/team" },
  { title: "Team Detail", url: "/dashboard/team/[teamId]" },
  { title: "Project Detail", url: "/dashboard/team/[teamId]/[projectId]" },
  { title: "Team Detail", url: "/dashboard/team/[id]" },
  { title: "Inbox Detail", url: "/dashboard/inbox/[id]" },
];

export const DashboardSection = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: profileData, isLoading } = api.profile.getProfile.useQuery();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const router = useRouter();

  const { session, handleSignOut } = useSession();

  const username = profileData?.username;

  let title = "Dashboard";

  if (router.pathname === "/dashboard" && !isLoading) {
    title = `Hi, ${username}`;
  } else {
    const currentPage = menuItems.find((item) => item.url === router.pathname);
    if (currentPage) {
      title = currentPage.title;
    }
  }

  return (
    <section className="flex w-full flex-col gap-y-5 p-6">
      <div className="flex w-full items-start justify-between md:items-center">
        <h3 className="ml-8 mt-1 text-xl font-bold md:ml-0 md:mt-0 md:text-2xl">
          {title}
        </h3>
        <div className="relative mr-2 flex items-center gap-5 md:mr-12 md:items-center">
          <NotificationsDropdown
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />

          <ProfileDropdown handleSignOut={handleSignOut} session={session} />
        </div>
      </div>
      {children}
    </section>
  );
};
