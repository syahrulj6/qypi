import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { Button } from "~/components/ui/button";
import { SendInboxModal } from "../components/SendInboxModal";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

type Message = {
  id: string;
  message: string;
  senderEmail: string;
  senderProfilePicture: string;
  receiverEmail: string;
  createdAt: string;
};

const InboxPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showModal, setShowModal] = useState(false);

  const { data: inboxData = [] } = api.inbox.getInbox.useQuery();

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

  api.inbox.onNewMessage.useSubscription(undefined, {
    onData(newMessage) {
      setMessages((prev) => [
        ...prev,
        {
          id: newMessage.id,
          message: newMessage.message,
          senderEmail: newMessage.senderEmail,
          senderProfilePicture: newMessage.senderProfilePicture,
          receiverEmail: newMessage.receiverEmail,
          createdAt: new Date(newMessage.createdAt).toISOString(),
        },
      ]);
    },
  });

  return (
    <DashboardLayout>
      <div className="mt-3 pr-0 md:mt-6 md:pr-8">
        <div className="mb-4 flex items-center justify-end">
          <Button onClick={() => setShowModal(true)}>Send Inbox</Button>
        </div>

        <div className="flex flex-col gap-2">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className="flex flex-col space-y-2 rounded-lg border px-4 py-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-10">
                      <AvatarFallback>VF</AvatarFallback>
                      <AvatarImage src={msg.senderProfilePicture} />
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="font-semibold">{msg.senderEmail}</p>
                      <div className="flex gap-2">
                        <p className="text-muted-foreground">Message:</p>
                        <p className="font-medium">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No messages found.</p>
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
