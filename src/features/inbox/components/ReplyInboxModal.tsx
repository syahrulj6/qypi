import { InboxFormInner } from "./InboxFormInner";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { inboxFormSchema, InboxFormSchema } from "../forms/inbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { LoaderCircleIcon, X } from "lucide-react";
import { ReplyInboxFormInner } from "./ReplyInboxFormInner";

interface ReplyInboxModalProps {
  inboxId: string;
  isOpen: boolean;
  onClose: () => void;
  router: any;
  receiverEmail: string;
}

export const ReplyInboxModal = ({
  isOpen,
  onClose,
  router,
  inboxId,
  receiverEmail,
}: ReplyInboxModalProps) => {
  const form = useForm<InboxFormSchema>({
    resolver: zodResolver(inboxFormSchema),
    defaultValues: {
      message: "",
      receiverEmail: receiverEmail ?? "",
    },
  });

  const replyInbox = api.inbox.replyInbox.useMutation();

  const handleReplyInbox = (data: InboxFormSchema) => {
    replyInbox.mutateAsync(
      {
        inboxId,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Inbox berhasil Dikirim!");
          onClose();
          router.push();
          form.reset();
        },
        onError: (err) => {
          toast.error("Gagal mengirim inbox: " + err.message);
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg border border-muted-foreground bg-card p-6 md:w-[30rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Balas Inbox</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data dibawah untuk membalas inbox
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleReplyInbox)}
            className="mt-2 grid grid-cols-2 gap-x-2 space-y-2"
          >
            <ReplyInboxFormInner />
            <Button
              type="submit"
              className="col-span-2 w-full"
              disabled={replyInbox.isPending}
            >
              {replyInbox.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
