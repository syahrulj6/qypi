import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { notebookFormSchema, type NotebookFormSchema } from "../forms/notebook";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { LoaderCircleIcon, X } from "lucide-react";
import { Form } from "~/components/ui/form";
import { NotebookFormInner } from "./NotebookFormInner";
import { Button } from "~/components/ui/button";

interface CreateNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const CreateNotebookModal = ({
  isOpen,
  onClose,
  refetch,
}: CreateNotebookModalProps) => {
  const form = useForm<NotebookFormSchema>({
    resolver: zodResolver(notebookFormSchema),
    defaultValues: {
      title: "",
      color: "#AA60C8",
    },
  });

  const createNotebook = api.notes.createNoteBook.useMutation();

  const handleCreateNotebook = (data: NotebookFormSchema) => {
    createNotebook.mutate(data, {
      onSuccess: () => {
        toast.success("Berhasil membuat Notebook");
        refetch();
        onClose();
        form.reset();
      },
      onError: () => {
        toast.error("Gagal membuat Notebook");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[22rem] rounded-lg border bg-card p-6 md:w-[30rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Buat Notebook</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data dibawah untuk membuat Notebook
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              form.handleSubmit(handleCreateNotebook)(e);
            }}
            className="mt-2 grid grid-cols-2 gap-x-2 space-y-2"
          >
            <NotebookFormInner />
            <Button
              type="submit"
              className="col-span-2 w-full"
              disabled={createNotebook.isPending}
            >
              {createNotebook.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Simpan Notebook"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
