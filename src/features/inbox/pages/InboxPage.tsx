import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { Button } from "~/components/ui/button";
import { SendInboxModal } from "../components/SendInboxModal";

type Message = {
  id: string;
  message: string;
  senderEmail: string;
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
          receiverEmail: newMessage.receiverEmail,
          createdAt: new Date(newMessage.createdAt).toISOString(),
        },
      ]);
    },
  });

  return (
    <DashboardLayout>
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Inbox</h1>
          <Button onClick={() => setShowModal(true)}>Send New Message</Button>
        </div>

        <div className="flex flex-col gap-2">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div key={msg.id} className="rounded-lg border p-2">
                <p className="text-black">
                  <strong>{msg.senderEmail}:</strong> {msg.message}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </p>
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
