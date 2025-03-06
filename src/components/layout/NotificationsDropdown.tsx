import { Bell, LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { useOutsideClick } from "~/hooks/useOutsideClick";
import { api } from "~/utils/api";

export const NotificationsDropdown = ({
  showNotifications,
  setShowNotifications,
}: {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}) => {
  const { data = [], isLoading, refetch } = api.inbox.getInbox.useQuery();
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  const markAsRead = api.inbox.markAsRead.useMutation();

  useEffect(() => {
    if (data) {
      const unreadMessages = data.filter((msg) => !msg.isRead);
      setUnreadCount(unreadMessages.length);
    }
  }, [data]);

  api.inbox.onNewInbox.useSubscription(undefined, {
    onData(newInbox) {
      if (!newInbox.isRead) {
        setUnreadCount((prev) => prev + 1);
      }
    },
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead.mutateAsync({ id });
      await router.push(`/dashboard/inbox/${id}`);
    } catch (error) {
      console.error("Failed to mark message as read or navigate:", error);
    } finally {
      setShowNotifications(false);
    }
  };

  const inboxData = data
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4);

  const notificationsRef = useRef<HTMLDivElement>(null);
  useOutsideClick(notificationsRef, () => setShowNotifications(false));

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="relative p-2"
        >
          <Bell className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary md:h-5 md:w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {showNotifications && (
        <div
          ref={notificationsRef}
          className="absolute right-0 top-10 z-20 flex w-40 flex-col gap-1 rounded-md border bg-card shadow-lg md:w-52"
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-2">
              <LoaderCircleIcon className="animate-spin" />
            </div>
          ) : (
            inboxData.map((data) => (
              <div
                key={data.id}
                className={`rounded-md border-b px-2 py-1 transition-colors hover:bg-primary/50 ${
                  !data.isRead ? "bg-gray-100" : ""
                }`}
              >
                <div
                  onClick={() => handleMarkAsRead(data.id)}
                  className="hover:cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">From: </span>
                    <p className="font-medium text-primary">
                      {data.sender.username}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">message:</p>
                  <p className="tracking-tight text-muted-foreground">
                    {data.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};
