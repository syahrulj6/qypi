import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  createProjectFormSchema,
  type CreateProjectFormSchmea,
} from "../forms/project";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { LoaderCircleIcon, X } from "lucide-react";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { CreateProjectFormInner } from "./CreateProjectFormInner";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  teamId: string;
}

export const CreateProjectModal = ({
  teamId,
  isOpen,
  onClose,
  refetch,
}: CreateProjectModalProps) => {
  const form = useForm<CreateProjectFormSchmea>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: new Date(),
      endDate: new Date(),
      teamId: teamId,
    },
  });

  const createProject = api.project.createProject.useMutation();

  const handleCreateProject = (data: CreateProjectFormSchmea) => {
    createProject.mutate(data, {
      onSuccess: () => {
        toast.success("Berhasil membuat project");
        refetch();
        onClose();
        form.reset();
      },
      onError: () => {
        toast.error("Gagal membuat project");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[22rem] rounded-lg border bg-card p-6 md:w-[30rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Buat Project</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data dibawah untuk membuat project
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              form.handleSubmit(handleCreateProject)(e);
            }}
            className="mt-2 grid grid-cols-2 gap-x-2 space-y-2"
          >
            <CreateProjectFormInner />
            <Button
              type="submit"
              className="col-span-2 w-full"
              disabled={createProject.isPending}
            >
              {createProject.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Buat project"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
