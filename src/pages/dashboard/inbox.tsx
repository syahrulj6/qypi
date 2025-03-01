import { api } from "~/utils/api";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

type Message = {
  id: string;
  message: string;
  receiverId: string;
  createdAt: string;
};

const Inbox = () => {
  const [message, setMessage] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const { data: inboxData = [] } = api.inbox.getInbox.useQuery();

  useEffect(() => {
    if (inboxData) {
      setMessages(
        inboxData.map((msg) => ({
          id: msg.id,
          message: msg.message,
          senderId: msg.sender.userId,
          receiverId: msg.receiver.userId,
          createdAt: new Date(msg.createdAt).toISOString(),
        })),
      );
    }
  }, [inboxData]);

  // Debounced function to update receiverEmail state
  const handleEmailChange = useCallback(
    debounce((email: string) => {
      setReceiverEmail(email);
    }, 700),
    [],
  );

  // Get receiver profile by email (only runs when receiverEmail is set)
  const { data: profileData } = api.profile.getProfileByEmail.useQuery(
    { email: receiverEmail },
    { enabled: !!receiverEmail },
  );

  api.inbox.onNewMessage.useSubscription(undefined, {
    onData(newMessage) {
      console.log("New message received:", newMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: newMessage.id,
          message: newMessage.message,
          senderId: newMessage.senderId,
          receiverId: newMessage.receiverId,
          createdAt: new Date(newMessage.createdAt).toISOString(),
        },
      ]);
    },
  });

  const sendMessage = api.inbox.sendInbox.useMutation({
    onSuccess: (sentMessage) => {
      setMessages((prev) => [
        ...prev,
        {
          id: sentMessage.id,
          message: sentMessage.message,
          senderId: sentMessage.senderId,
          receiverId: sentMessage.receiverId,
          createdAt: new Date(sentMessage.createdAt).toISOString(),
        },
      ]);
    },
  });

  const handleSend = async () => {
    if (!message.trim() || !profileData?.userId) return;

    // Optimistic UI update before mutation
    const tempMessage: Message = {
      id: Math.random().toString(),
      message,
      receiverId: profileData.userId,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    await sendMessage.mutateAsync({ message, receiverId: profileData.userId });
    setMessage("");
  };

  return (
    <DashboardLayout>
      <div>
        <Input
          placeholder="Receiver's Email"
          onChange={(e) => handleEmailChange(e.target.value)}
        />

        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handleSend} disabled={!profileData?.userId}>
          Send
        </Button>

        <div className="flex flex-col gap-2">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <p key={msg.id} className="text-black">
                {msg.message}
              </p>
            ))
          ) : (
            <p>No messages found.</p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inbox;
