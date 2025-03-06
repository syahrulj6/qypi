import { LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useOutsideClick } from "~/hooks/useOutsideClick";
import { api } from "~/utils/api";

type NotificationsType = {
  id: string;
  title: string;
  from: string;
  date: Date;
  link: string;
};

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

export const NotificationsDropdown = ({
  showNotifications,
  setShowNotifications,
}: {
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
}) => {
  const { data = [], isLoading } = api.inbox.getInbox.useQuery();

  const inboxData = data
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 4);

  const notificationsRef = useRef<HTMLDivElement>(null);
  useOutsideClick(notificationsRef, () => setShowNotifications(false));

  return (
    showNotifications && (
      <div className="absolute right-0 top-8 z-20 flex w-40 flex-col gap-1 rounded-md border bg-card md:w-52">
        {isLoading && (
          <div className="flex">
            <LoaderCircleIcon className="animate-spin" />
          </div>
        )}

        {inboxData.map((data) => (
          <div
            ref={notificationsRef}
            key={data.id}
            className="rounded-md border-b px-2 py-1 transition-colors hover:bg-primary/50"
          >
            <Link href={`/dashboard/inbox/${data.id}`}>
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
            </Link>
          </div>
        ))}
      </div>
    )
  );
};
