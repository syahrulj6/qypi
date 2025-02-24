import { Folder, File, Plus } from "lucide-react";
import { useState } from "react";

export const CreateNoteMenuButton = () => {
  const [openMenuButton, setOpenMenuButton] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-center space-y-3 md:bottom-16 md:right-16">
      {/* Folder & File Buttons */}
      <div
        className={`flex flex-col items-center space-y-3 transition-all duration-300 ${
          openMenuButton
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <button className="rounded-xl bg-purple-300 p-3 transition-colors hover:bg-purple-400">
          <Folder className="h-6 w-6 text-primary" />
        </button>
        <button className="rounded-xl bg-purple-300 p-3 transition-colors hover:bg-purple-400">
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
