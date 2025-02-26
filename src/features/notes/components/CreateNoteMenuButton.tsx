import { Folder, File, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { useOutsideClick } from "~/hooks/useOutsideClick";

interface CreateNoteMenuButton {
  onOpenNote: () => void;
  onOpenNotebook: () => void;
}

export const CreateNoteMenuButton = ({
  onOpenNote,
  onOpenNotebook,
}: CreateNoteMenuButton) => {
  const [openMenuButton, setOpenMenuButton] = useState(false);

  const menuButtonRef = useRef<HTMLDivElement>(null);
  useOutsideClick(menuButtonRef, () => setOpenMenuButton(false));

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-3 md:bottom-16 md:right-16">
      <div
        ref={menuButtonRef}
        className={`flex flex-col items-center space-y-3 transition-all duration-300 ${
          openMenuButton
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <button
          className="rounded-xl bg-purple-300 p-3 transition-colors hover:bg-purple-400"
          onClick={onOpenNotebook}
        >
          <Folder className="h-6 w-6 text-primary" />
        </button>
        <button
          className="rounded-xl bg-purple-300 p-3 transition-colors hover:bg-purple-400"
          onClick={onOpenNote}
        >
          <File className="h-6 w-6 text-primary" />
        </button>
      </div>

      <button
        className="rounded-xl bg-primary p-3 transition-colors hover:bg-purple-900"
        onClick={() => setOpenMenuButton(!openMenuButton)}
      >
        <Plus
          className="h-6 w-6 text-white transition-transform duration-300"
          style={{
            transform: openMenuButton ? "rotate(45deg)" : "rotate(0deg)",
          }}
        />
      </button>
    </div>
  );
};
