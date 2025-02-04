import { api } from "~/utils/api";
import { ProfileDropdown } from "./ProfileDropdown";
import { useSession } from "~/hooks/useSession";

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
          Good morning {getProfileData?.username}!
        </h1>
        <div className="mr-8 flex items-center gap-2">
          <ProfileDropdown handleSignOut={handleSignOut} session={session} />
        </div>
      </div>
      {children}
    </section>
  );
};
