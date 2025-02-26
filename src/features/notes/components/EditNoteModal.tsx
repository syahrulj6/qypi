import { useForm } from "react-hook-form";
import { noteFormSchema, type NoteFormSchema } from "../forms/note";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { NoteFormInner } from "./NoteFormInner";

interface EditNoteModalProps {
  noteId: string;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const EditNoteModal = ({
  isOpen,
  onClose,
  noteId,
  refetch,
}: EditNoteModalProps) => {
  const { data: getNoteData } = api.notes.getNoteById.useQuery({
    noteId,
  });

  const form = useForm<NoteFormSchema>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (getNoteData) {
      form.reset({
        title: getNoteData.title,
        content: getNoteData.content ?? "",
      });
    }
  }, [getNoteData, form]);

  const editNote = api.notes.editNote.useMutation();

  const handleEditNote = (data: NoteFormSchema) => {
    editNote.mutate(
      {
        noteId,
        ...data,
      },
      {
        onSuccess: () => {
          toast.success("Berhasil update event!");
          refetch();
          onClose();
        },
        onError: () => {
          toast.error("Gagal update event!");
          onClose();
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
            <h2 className="text-xl font-semibold">Edit Note</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Isi data di bawah
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEditNote)}
            className="mt-2 grid grid-cols-2 gap-x-2 space-y-2"
          >
            <NoteFormInner />
            <Button type="submit" className="col-span-2 w-full">
              Simpan Perubahan
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};
