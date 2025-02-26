import { Edit, EllipsisIcon, File, Folder, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/utils/api";

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
  const defaultColor = "#AA60C8";
  const bgColor = type === "folder" && color ? color : defaultColor;
  const bgColorWithOpacity = `${bgColor}99`;

  const deleteNote = api.notes.deleteNoteById.useMutation();

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

  return (
    <div
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size={"icon"}
                  onClick={(e) => e.stopPropagation()}
                >
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="z-20 flex w-fit flex-col gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="secondary" size={"icon"}>
                  <Edit />
                </Button>

                <Button variant="destructive" size={"icon"}>
                  <Trash />
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 text-neutral-700">
            <div className="flex gap-2">
              <File />
              <p>Note</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size={"icon"}
                  onClick={(e) => e.stopPropagation()}
                >
                  <EllipsisIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="z-20 flex w-fit flex-col gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <Button variant="secondary" size={"icon"}>
                  <Edit />
                </Button>

                <Button
                  variant="destructive"
                  size={"icon"}
                  onClick={handleDeleteNote}
                >
                  <Trash />
                </Button>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <p className="font-semibold">{title}</p>
      </div>
    </div>
  );
};
