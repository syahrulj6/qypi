import { api } from "~/utils/api";
import { ProfileDropdown } from "./ProfileDropdown";
import { useSession } from "~/hooks/useSession";
import Link from "next/link";
import { Bell, Calendar, MessageSquareMore } from "lucide-react";

export const DashboardSection = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session, handleSignOut } = useSession();

  const { data: getProfileData } = api.profile.getProfile.useQuery(undefined, {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000), // Eksponensial backoff
  });

  return (
    <section className="flex w-full flex-col p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-3xl font-bold">
          Good morning, {getProfileData?.username}!
        </h1>
        <div className="mr-8 flex items-center gap-5">
          <Link href="/calendar">
            <Calendar className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <Link href="/inbox">
            <MessageSquareMore className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </Link>
          <button>
            <Bell className="h-5 w-5 text-muted-foreground transition-colors hover:text-primary" />
          </button>

          <ProfileDropdown handleSignOut={handleSignOut} session={session} />
        </div>
      </div>
      {children}
    </section>
  );
};
