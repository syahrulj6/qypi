import { Folder, Plus, UserRoundPlus } from "lucide-react";
import { useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface TeamDetailMenuButtonProps {
  onOpenCreateProject: () => void;
  onOpenAddMember: () => void;
}

export const TeamDetailMenuButton = ({
  onOpenCreateProject,
  onOpenAddMember,
}: TeamDetailMenuButtonProps) => {
  const [openMenuButton, setOpenMenuButton] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-10 flex flex-col items-center space-y-3 md:bottom-16 md:right-16">
      <div
        className={`flex flex-col items-center space-y-3 transition-all duration-300 ${
          openMenuButton
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="rounded-xl bg-purple-300 p-3 transition-colors hover:bg-purple-400"
                onClick={onOpenAddMember}
              >
                <UserRoundPlus className="h-6 w-6 text-primary" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="rounded-md bg-purple-300 p-2 text-base text-primary md:text-lg">
                Add Member
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="rounded-xl bg-purple-300 p-3 transition-colors hover:bg-purple-400"
                onClick={onOpenCreateProject}
              >
                <Folder className="h-6 w-6 text-primary" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="rounded-md bg-purple-300 p-2 text-base text-primary md:text-lg">
                Create Project
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
