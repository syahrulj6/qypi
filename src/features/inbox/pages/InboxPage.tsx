import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { Button } from "~/components/ui/button";
import { SendInboxModal } from "../components/SendInboxModal";
import { InboxCard } from "../components/InboxCard";
import { LoaderCircleIcon, Search } from "lucide-react";
import { debounce } from "lodash";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

type Inbox = {
  id: string;
  subject: string;
  message: string;
  senderEmail: string;
  senderProfilePicture: string;
  receiverEmail: string;
  createdAt: string;
  parentId: string;
  isRead: boolean;
};

const InboxPage = () => {
  const [messages, setMessages] = useState<Inbox[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<Inbox[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const handleSearch = debounce((e) => {
    setSearch(e.target.value);
  }, 400);

  const {
    data: inboxData = [],
    isLoading,
    refetch,
  } = api.inbox.getInbox.useQuery({}, { staleTime: 5000 });

  const markAsRead = api.inbox.markAsRead.useMutation();

  useEffect(() => {
    if (inboxData) {
      const formattedMessages = inboxData.map((msg) => ({
        id: msg.id,
        subject: msg.subject,
        message: msg.message,
        senderEmail: msg.sender.email,
        senderProfilePicture: msg.sender.profilePictureUrl ?? "",
        receiverEmail: msg.receiver.email,
        createdAt: new Date(msg.createdAt).toISOString(),
        parentId: msg.parentId ?? "",
        isRead: msg.isRead,
      }));
      setMessages(formattedMessages);
      setFilteredMessages(formattedMessages);
    }
  }, [inboxData]);

  useEffect(() => {
    if (search) {
      const filtered = messages.filter((msg) =>
        msg.subject.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredMessages(filtered);
    } else {
      setFilteredMessages(messages);
    }
  }, [search, messages]);

  api.inbox.onNewInbox.useSubscription(undefined, {
    onData(newInbox) {
      setMessages((prev) => [
        ...prev,
        {
          id: newInbox.id,
          subject: newInbox.subject,
          message: newInbox.message,
          senderEmail: newInbox.senderEmail,
          senderProfilePicture: newInbox.senderProfilePicture,
          receiverEmail: newInbox.receiverEmail,
          createdAt: new Date(newInbox.createdAt).toISOString(),
          parentId: newInbox.parentId,
          isRead: newInbox.isRead,
        },
      ]);
    },
  });

  const handleMarkAsRead = async (id: string) => {
    await markAsRead.mutateAsync({ id });
    refetch();
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mt-10 flex w-full items-center justify-center">
          <LoaderCircleIcon className="animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mt-3 pr-0 md:mt-6 md:pr-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-4/5 md:w-2/6">
            <Input
              id="search"
              placeholder="Search inbox"
              onChange={handleSearch}
              className="pl-10 text-sm md:pl-12 md:text-base"
            />
            <Label htmlFor="search">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground md:h-5 md:w-5" />
            </Label>
          </div>
          <Button onClick={() => setShowModal(true)}>Send Inbox</Button>
        </div>

        <div className="flex flex-col gap-2">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <InboxCard
                key={msg.id}
                parentId={msg.parentId}
                subject={msg.subject}
                refetch={refetch}
                id={msg.id}
                createdAt={msg.createdAt}
                message={msg.message}
                senderEmail={msg.senderEmail}
                receiverEmail={msg.receiverEmail}
                senderProfilePicture={msg.senderProfilePicture}
                isRead={msg.isRead}
                onMarkAsRead={() => handleMarkAsRead(msg.id)}
              />
            ))
          ) : (
            <p>No inbox found.</p>
          )}
        </div>

        {showModal && (
          <SendInboxModal
            onClose={() => setShowModal(false)}
            isOpen={showModal}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default InboxPage;
