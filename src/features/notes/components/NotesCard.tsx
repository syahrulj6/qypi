import { Edit, EllipsisIcon, File, Folder, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/utils/api";
import { EditNoteModal } from "./EditNoteModal";
import { EditNotebookModal } from "./EditNotebookModal";
import { useRouter } from "next/router";

interface NotesCardProps {
  id: string;
  title: string;
  type: "folder" | "file";
  color?: string | null;
  content?: string | null;
  notesCount?: number;
  updatedAt: Date;
  refetch: () => void;
}

export const NotesCard = ({
  id,
  title,
  type,
  color,
  notesCount,
  refetch,
}: NotesCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [showEditNotebookModal, setShowEditNotebookModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  const defaultColor = "#AA60C8";
  const bgColor = type === "folder" && color ? color : defaultColor;
  const bgColorWithOpacity = `${bgColor}99`;

  const deleteNote = api.notes.deleteNoteById.useMutation();
  const deleteNotes = api.notes.deleteNotesById.useMutation();

  const handleDeleteNote = () => {
    deleteNote.mutate(
      {
        noteId: id,
      },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus note!");
          refetch();
        },
        onError: (err) => {
          toast.error("Gagal menghapus note" + err.message);
        },
      },
    );
  };

  const handleDeleteNotes = () => {
    deleteNotes.mutate(
      {
        notebookId: id,
      },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus notes!");
          refetch();
        },
        onError: (err) => {
          toast.error("Gagal menghapus notes" + err.message);
        },
      },
    );
  };

  return (
    <>
      <div
        onClick={() => router.push(`/dashboard/notes/${id}`)}
        style={{
          backgroundColor: bgColorWithOpacity,
          transition: "background-color 0.3s ease",
        }}
        className="h-32 cursor-pointer rounded-md p-4 transition hover:opacity-100"
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = bgColorWithOpacity)
        }
      >
        <div className="flex flex-col space-y-2">
          {type === "folder" ? (
            <div className="flex items-center justify-between gap-2 text-neutral-700">
              <div className="flex gap-2">
                <Folder />
                <p>{notesCount} Notes</p>
              </div>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size={"icon"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen((prev) => !prev);
                    }}
                  >
                    <EllipsisIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="flex w-fit flex-col gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="secondary"
                    size={"icon"}
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowEditNotebookModal(true);
                    }}
                  >
                    <Edit />
                  </Button>

                  <AlertDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" type="button">
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Konfirmasi hapus Notes
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus notes? Perubahan ini
                          bersifat permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 transition-colors hover:bg-red-600"
                          onClick={() => {
                            setIsDialogOpen(false);
                            handleDeleteNotes();
                          }}
                        >
                          Ya, Hapus Notes
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 text-neutral-700">
              <div className="flex gap-2">
                <File />
                <p>Note</p>
              </div>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size={"icon"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen((prev) => !prev);
                    }}
                  >
                    <EllipsisIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="flex w-fit flex-col gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="secondary"
                    size={"icon"}
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowEditNoteModal(true);
                    }}
                  >
                    <Edit />
                  </Button>

                  <AlertDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" type="button">
                        <Trash />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Konfirmasi hapus Note
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus note? Perubahan ini
                          bersifat permanen.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 transition-colors hover:bg-red-600"
                          onClick={() => {
                            setIsDialogOpen(false);
                            handleDeleteNote();
                          }}
                        >
                          Ya, Hapus Note
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          <p className="font-semibold">{title}</p>
        </div>
      </div>

      {showEditNoteModal && (
        <EditNoteModal
          refetch={refetch}
          noteId={id}
          isOpen={showEditNoteModal}
          onClose={() => setShowEditNoteModal(false)}
        />
      )}

      {showEditNotebookModal && (
        <EditNotebookModal
          refetch={refetch}
          notebookId={id}
          isOpen={showEditNotebookModal}
          onClose={() => setShowEditNotebookModal(false)}
        />
      )}
    </>
  );
};
