import { File, Folder } from "lucide-react";

interface NotesCardProps {
  id: string;
  title: string;
  type: "folder" | "file";
  color?: string | null; // Only folders have color
  content?: string | null;
  notesCount?: number;
  updatedAt: Date;
}

export const NotesCard = ({
  title,
  type,
  color,
  notesCount,
}: NotesCardProps) => {
  const defaultColor = "#AA60C8";
  const bgColor = type === "folder" && color ? color : defaultColor;
  const bgColorWithOpacity = `${bgColor}99`;

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
          <div className="flex items-center gap-2 text-neutral-700">
            <Folder />
            <p>{notesCount} Notes</p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-neutral-700">
            <File />
            <p>Note</p>
          </div>
        )}
        <p className="font-semibold">{title}</p>
      </div>
    </div>
  );
};
