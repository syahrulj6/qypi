import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { notebookFormSchema, type NotebookFormSchema } from "../forms/notebook";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Form } from "~/components/ui/form";
import { NotebookFormInner } from "./NotebookFormInner";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";

interface EditNotebookModalProps {
  notebookId: string;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditNotebookModal = ({
  notebookId,
  isOpen,
  onClose,
  refetch,
}: EditNotebookModalProps) => {
  const { data: getNotebookData } = api.notes.getNotebookById.useQuery({
    notebookId,
  });

  const form = useForm<NotebookFormSchema>({
    resolver: zodResolver(notebookFormSchema),
    defaultValues: {
      title: "",
      color: "",
    },
  });

  useEffect(() => {
    if (getNotebookData) {
      form.reset({
        title: getNotebookData.title,
        color: getNotebookData.color ?? "",
      });
    }
  }, [getNotebookData, form]);

  const editNotebook = api.notes.editNotebook.useMutation();

  const handleEditNotebook = (data: NotebookFormSchema) => {
    editNotebook.mutate(
      {
        notebookId,
        title: data.title,
        color: data.color ?? "",
      },
      {
        onSuccess: () => {
          toast.success("Berhasil mengedit Notebook");
          refetch();
          onClose();
        },
        onError: () => {
          toast.error("Gagal mengedit Notebook");
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[22rem] rounded-lg border bg-card p-6 md:w-[30rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Edit Notebook</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data dibawah
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              form.handleSubmit(handleEditNotebook)(e);
            }}
            className="mt-2 grid grid-cols-2 gap-x-2 space-y-2"
          >
            <NotebookFormInner />
            <Button type="submit" className="col-span-2 w-full">
              Simpan Perubahan
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
