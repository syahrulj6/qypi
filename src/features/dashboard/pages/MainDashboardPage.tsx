import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { api } from "~/utils/api";

export default function MainDashboardPage() {
  const { data: getProfileData } = api.profile.getProfile.useQuery(undefined, {
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 3000),
  });

  return (
    <SessionRoute>
      <DashboardLayout>
        <div className="flex flex-col space-y-3">
          <h1 className="text-xl font-bold tracking-tight md:text-3xl">
            Good morning, {getProfileData?.username}!
          </h1>
        </div>
      </DashboardLayout>
    </SessionRoute>
  );
}
