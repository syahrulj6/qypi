import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { LoaderCircleIcon, X } from "lucide-react";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import {
  updateProjectTitleFormSchema,
  type UpdateProjectTitleFormSchema,
} from "../forms/project";
import { UpdateProjectTitleFormInner } from "./UpdateProjectTitleFormInner";

interface UpdateProjectTitleProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  projectId: string;
  projectName: string;
}

export const UpdateProjectTitleModal = ({
  projectName,
  projectId,
  isOpen,
  onClose,
  refetch,
}: UpdateProjectTitleProps) => {
  const form = useForm<UpdateProjectTitleFormSchema>({
    resolver: zodResolver(updateProjectTitleFormSchema),
    defaultValues: {
      name: projectName,
      projectId: projectId,
    },
  });

  const createTask = api.project.updateProjectTitleById.useMutation();

  const handleCreateTask = (data: UpdateProjectTitleFormSchema) => {
    createTask.mutate(data, {
      onSuccess: () => {
        toast.success("Berhasil update project title");
        refetch();
        onClose();
        form.reset();
      },
      onError: () => {
        toast.error("Gagal update project title");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[22rem] rounded-lg border bg-card p-6 md:w-[30rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Update Project Title</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data dibawah untuk update project title
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              form.handleSubmit(handleCreateTask)(e);
            }}
            className="mt-2 grid grid-cols-2 gap-x-2 space-y-2"
          >
            <UpdateProjectTitleFormInner />
            <Button
              type="submit"
              className="col-span-2 w-full"
              disabled={createTask.isPending}
            >
              {createTask.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Buat Task"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
