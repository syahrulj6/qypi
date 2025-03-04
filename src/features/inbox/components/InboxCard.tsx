import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface Message {
  id: string;
  message: string;
  senderEmail: string;
  senderProfilePicture: string;
  createdAt: string;
}

export const InboxCard = ({
  id,
  createdAt,
  message,
  senderEmail,
  senderProfilePicture,
}: Message) => {
  return (
    <div
      key={id}
      className="flex flex-col space-y-2 rounded-lg border px-4 py-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-10">
            <AvatarFallback>VF</AvatarFallback>
            <AvatarImage src={senderProfilePicture} />
          </Avatar>
          <div className="flex flex-col">
            <p className="font-semibold">{senderEmail}</p>
            <div className="flex gap-2">
              <p className="text-muted-foreground">Message:</p>
              <p className="font-medium">{message}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};
