import DashboardLayout from "~/components/layout/DashboardLayout";
import { CreateNoteMenuButton } from "../components/CreateNoteMenuButton";
import { useEffect, useState } from "react";
import { CreateNoteModal } from "../components/CreateNoteModal";
import { CreateNotebookModal } from "../components/CreateNotebookModal";
import { api } from "~/utils/api";
import { NotesCard } from "../components/NotesCard";
import { LoaderCircleIcon, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { debounce } from "lodash";
import { Label } from "~/components/ui/label";

interface NotesCardProps {
  id: string;
  title: string;
  type: "notebook" | "note";
  color?: string | null;
  content?: string | null;
  notesCount?: number;
  updatedAt: Date;
}

export const NotesPage = () => {
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [showCreateNotebooksModal, setShowCreateNotebooksModal] =
    useState(false);
  const [search, setSearch] = useState("");

  const {
    data: notesAndNotebooks,
    isLoading,
    refetch,
  } = api.notes.getAllNotesAndNotebooks.useQuery(
    { title: search },
    { staleTime: 5000 },
  );

  const handleSearch = debounce((e) => {
    setSearch(e.target.value);
  }, 300);

  useEffect(() => {
    if (!isLoading) {
      refetch();
    }
  }, [
    isLoading,
    showCreateNoteModal,
    showCreateNotebooksModal,
    refetch,
    search,
  ]);

  return (
    <DashboardLayout>
      <CreateNoteMenuButton
        onOpenNote={() => setShowCreateNoteModal(true)}
        onOpenNotebook={() => setShowCreateNotebooksModal(true)}
      />
      {showCreateNoteModal && (
        <CreateNoteModal
          refetch={refetch}
          isOpen={showCreateNoteModal}
          onClose={() => setShowCreateNoteModal(false)}
        />
      )}
      {showCreateNotebooksModal && (
        <CreateNotebookModal
          refetch={refetch}
          isOpen={showCreateNotebooksModal}
          onClose={() => setShowCreateNotebooksModal(false)}
        />
      )}

      <div className="mt-2 flex flex-col md:pr-10">
        <div className="relative w-4/5 md:w-2/6">
          <Input
            id="search"
            placeholder="Search note/notebook..."
            onChange={handleSearch}
            className="pl-10 text-sm md:pl-12 md:text-base"
          />
          <Label htmlFor="search">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground md:h-5 md:w-5" />
          </Label>
        </div>

        {isLoading ? (
          <div className="md:mt-15 mt-10 flex w-full items-center justify-center">
            <LoaderCircleIcon className="animate-spin" />
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {notesAndNotebooks?.map((item) => (
              <NotesCard
                refetch={refetch}
                key={item.id}
                {...(item as NotesCardProps)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotesPage;
