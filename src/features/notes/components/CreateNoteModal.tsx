import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { noteFormSchema, NoteFormSchema } from "../forms/note";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { LoaderCircleIcon, X } from "lucide-react";
import { Form } from "~/components/ui/form";
import { NoteFormInner } from "./NoteFormInner";
import { Button } from "~/components/ui/button";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
  notebookId?: string;
}

export const CreateNoteModal = ({
  isOpen,
  onClose,
  refetch,
  notebookId,
}: CreateNoteModalProps) => {
  const form = useForm<NoteFormSchema>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createNote = api.notes.createNote.useMutation();

  const handleCreateNote = (data: NoteFormSchema) => {
    createNote.mutate(
      {
        notebookId,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Berhasil membuat Note");
          refetch();
          onClose();
          form.reset();
        },
        onError: () => {
          toast.error("Gagal membuat Note");
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[22rem] rounded-lg border border-muted-foreground bg-card p-6 md:w-[30rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">Buat Note</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data dibawah untuk menambahkan Note
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateNote)}
            className="mt-2 grid grid-cols-2 gap-x-2 space-y-2"
          >
            <NoteFormInner />
            <Button
              disabled={createNote.isPending}
              type="submit"
              className="col-span-2 w-full"
            >
              {createNote.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                "Simpan Note"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
