import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addMemberFormSchema, type AddMemberFormSchema } from "../forms/member";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { LoaderCircleIcon, X } from "lucide-react";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { AddTeamMemberFormInner } from "./AddTeamMemberFormInner";

interface AddTeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetchTeamData: () => void;
  refetchProjectData: () => void;
  teamId: string;
}

export const AddTeamMemberModal = ({
  teamId,
  isOpen,
  onClose,
  refetchTeamData,
  refetchProjectData,
}: AddTeamMemberModalProps) => {
  const form = useForm<AddMemberFormSchema>({
    resolver: zodResolver(addMemberFormSchema),
    defaultValues: {
      email: "",
      teamId: teamId,
    },
  });

  const addMember = api.team.addTeamMember.useMutation();

  const handleAddMember = (data: AddMemberFormSchema) => {
    addMember.mutate(data, {
      onSuccess: () => {
        toast.success("Berhasil menambahkan member");
        refetchTeamData();
        refetchProjectData();
        onClose();
        form.reset();
      },
      onError: () => {
        toast.error("Gagal menambahkan member");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[22rem] rounded-lg border bg-card p-6 md:w-[30rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Tambah Member</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data dibawah untuk menambahkan member
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              form.handleSubmit(handleAddMember)(e);
            }}
            className="mt-2 grid grid-cols-2 gap-x-2 space-y-2"
          >
            <AddTeamMemberFormInner />
            <Button
              type="submit"
              className="col-span-2 w-full"
              disabled={addMember.isPending}
            >
              {addMember.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Tambah Member"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
