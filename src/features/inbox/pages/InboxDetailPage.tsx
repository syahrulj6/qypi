import { ArrowLeft, ChevronDown, LoaderCircleIcon, Trash } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/components/ui/dropdown-menu";
import { api } from "~/utils/api";

const InboxDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id === undefined) return;
    if (!id) router.push("/dashboard/inbox");
  }, [id, router]);

  const { data: inboxData, isLoading } = api.inbox.getInboxById.useQuery(
    { id: id as string },
    { enabled: !!id },
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mt-10 flex w-full items-center justify-center">
          <LoaderCircleIcon className="animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!inboxData) {
    return (
      <DashboardLayout>
        <div className="mt-10 text-center text-lg">Inbox not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mt-2 flex flex-col space-y-8 md:mt-4 md:pr-10">
        <div className="flex items-center justify-between">
          <button className="group" onClick={() => router.back()}>
            <ArrowLeft className="text-neutral-700 transition-colors group-hover:text-current" />
          </button>

          <Button variant="destructive" size="icon">
            <Trash />
          </Button>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-10">
              <AvatarFallback>VF</AvatarFallback>
              <AvatarImage src={inboxData.sender.profilePictureUrl!} />
            </Avatar>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <p className="font-semibold">
                  {inboxData.sender.username}
                  <span className="text-muted-foreground">:</span>
                </p>
                <p className="text-muted-foreground">{inboxData.senderEmail}</p>
              </div>
              <div className="flex gap-1">
                <p className="text-muted-foreground">To me:</p>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="flex flex-col justify-center px-4 py-2">
                    <DropdownMenuItem>
                      <p className="text-muted-foreground">From:</p>
                      <p className="font-semibold">
                        {inboxData.sender.username}
                      </p>
                      <p className="text-muted-foreground">
                        {"<"}
                        {inboxData.senderEmail}
                        {">"}
                      </p>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <p className="text-muted-foreground">To:</p>
                      <p className="font-semibold">{inboxData.receiverEmail}</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <p className="text-muted-foreground">Date:</p>
                      <p className="font-semibold">
                        {inboxData.createdAt.toLocaleString()}
                      </p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InboxDetailPage;
