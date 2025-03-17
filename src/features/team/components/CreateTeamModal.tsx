import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { teamFormSchema, type TeamFormSchema } from "../forms/team";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { LoaderCircleIcon, X } from "lucide-react";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { CreateTeamFormInner } from "./CreateTeamFormInner";

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreateNotebookModal = ({
  isOpen,
  onClose,
  refetch,
}: CreateTeamModalProps) => {
  const form = useForm<TeamFormSchema>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createTeam = api.team.createTeam.useMutation();

  const handleCreateTeam = (data: TeamFormSchema) => {
    createTeam.mutate(data, {
      onSuccess: () => {
        toast.success("Berhasil membuat Team");
        refetch();
        onClose();
        form.reset();
      },
      onError: () => {
        toast.error("Gagal membuat Team");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[22rem] rounded-lg border bg-card p-6 md:w-[30rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Buat Team</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data dibawah untuk membuat team
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              form.handleSubmit(handleCreateTeam)(e);
            }}
            className="mt-2 grid grid-cols-2 gap-x-2 space-y-2"
          >
            <CreateTeamFormInner />
            <Button
              type="submit"
              className="col-span-2 w-full"
              disabled={createTeam.isPending}
            >
              {createTeam.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Buat Team"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
