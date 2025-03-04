import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";

const InboxDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id === undefined) return;
    if (!id) router.push("/dashboard/inbox");
  }, [id, router]);

  const { data, isLoading } = api.inbox.getInboxById.useQuery(
    { id: id as string },
    { enabled: !!id },
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mt-10 flex w-full items-center justify-center">
          <LoaderCircleIcon className="animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="mt-10 text-center text-lg">Inbox not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="">Inbox id: {id}</div>
    </DashboardLayout>
  );
};

export default InboxDetailPage;
