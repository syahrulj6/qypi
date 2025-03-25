import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createTaskFormSchema, type CreateTaskFormSchema } from "../forms/task";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { LoaderCircleIcon, X } from "lucide-react";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { CreateTaskFormInner } from "./CreateTaskFormInner";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  projectId: string;
}

export const CreateTaskModal = ({
  projectId,
  isOpen,
  onClose,
  refetch,
}: CreateTaskModalProps) => {
  const form = useForm<CreateTaskFormSchema>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: projectId,
      dueDate: new Date(),
      status: "Pending",
      priority: "Medium",
    },
  });

  const createTask = api.task.createTask.useMutation();

  const handleCreateTask = (data: CreateTaskFormSchema) => {
    createTask.mutate(data, {
      onSuccess: () => {
        toast.success("Berhasil membuat task");
        refetch();
        onClose();
        form.reset();
      },
      onError: () => {
        toast.error("Gagal membuat task");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[22rem] rounded-lg border bg-card p-6 md:w-[30rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Buat Task</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data dibawah untuk membuat task
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
            <CreateTaskFormInner />
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
