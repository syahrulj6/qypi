import { api } from "~/utils/api";
import { useState } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

type Message = {
  id: string;
  message: string;
  senderId: string;
  created_at: string;
};

const Inbox = () => {
  const [message, setMessage] = useState("");
  const [receiverEmail, setReceiverEmail] = useState(""); // Receiver email input

  const { data: inboxData = [] } = api.inbox.getInbox.useQuery(); // ✅ Provide default empty array

  const { data: profileData } = api.profile.getProfileByEmail.useQuery(
    { email: receiverEmail },
    { enabled: !!receiverEmail }, // Only fetch when email is provided
  );

  const { data: messages = [] } = api.inbox.onNewMessage.useSubscription(
    undefined,
    {
      onData(data) {
        console.log("New message received:", data);
      },
    },
  );

  const sendMessage = api.inbox.sendInbox.useMutation();

  const handleSend = async () => {
    if (!message.trim() || !profileData?.userId) return; // Ensure userId exists
    await sendMessage.mutateAsync({ message, receiverId: profileData.userId });
    setMessage("");
  };

  return (
    <DashboardLayout>
      <div>
        <Input
          placeholder="Receiver's Email"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
        />
        <div>
          {messages.map((msg: Message) => (
            <p key={msg.id}>{msg.message}</p>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {inboxData.length > 0 ? ( // ✅ Check if inboxData has items
            inboxData.map((inbox) => <div key={inbox.id}>{inbox.message}</div>)
          ) : (
            <p>No messages found.</p> // ✅ Handle empty state
          )}
        </div>
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={handleSend} disabled={!profileData?.userId}>
          Send
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Inbox;
