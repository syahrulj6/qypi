import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { Button } from "~/components/ui/button";
import { SendInboxModal } from "../components/SendInboxModal";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { InboxCard } from "../components/InboxCard";
import { LoaderCircleIcon } from "lucide-react";

type Inbox = {
  id: string;
  message: string;
  senderEmail: string;
  senderProfilePicture: string;
  receiverEmail: string;
  createdAt: string;
};

const InboxPage = () => {
  const [messages, setMessages] = useState<Inbox[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { data: inboxData = [], isLoading } = api.inbox.getInbox.useQuery();

  useEffect(() => {
    if (inboxData) {
      setMessages(
        inboxData.map((msg) => ({
          id: msg.id,
          message: msg.message,
          senderEmail: msg.sender.email,
          senderProfilePicture: msg.sender.profilePictureUrl ?? "",
          receiverEmail: msg.receiver.email,
          createdAt: new Date(msg.createdAt).toISOString(),
        })),
      );
    }
  }, [inboxData]);

  api.inbox.onNewInbox.useSubscription(undefined, {
    onData(newInbox) {
      setMessages((prev) => [
        ...prev,
        {
          id: newInbox.id,
          message: newInbox.message,
          senderEmail: newInbox.senderEmail,
          senderProfilePicture: newInbox.senderProfilePicture,
          receiverEmail: newInbox.receiverEmail,
          createdAt: new Date(newInbox.createdAt).toISOString(),
        },
      ]);
    },
  });

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
        <div className="mb-4 flex items-center justify-end">
          <Button onClick={() => setShowModal(true)}>Send Inbox</Button>
        </div>

        <div className="flex flex-col gap-2">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <InboxCard
                id={msg.id}
                createdAt={msg.createdAt}
                message={msg.message}
                senderEmail={msg.senderEmail}
                senderProfilePicture={msg.senderProfilePicture}
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
