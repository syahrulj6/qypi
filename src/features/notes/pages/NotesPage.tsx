import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { CreateNoteMenuButton } from "../components/CreateNoteMenuButton";
import { useEffect, useState } from "react";
import { CreateNoteModal } from "../components/CreateNoteModal";
import { CreateNotebookModal } from "../components/CreateNotebookModal";
import { api } from "~/utils/api";
import { NotesCard } from "../components/NotesCard";
import { LoaderCircleIcon } from "lucide-react";

interface NotesCardProps {
  id: string;
  title: string;
  type: "folder" | "file";
  color?: string | null;
  content?: string | null;
  notesCount?: number;
  updatedAt: Date;
}

export const NotesPage = () => {
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [showCreateNotebooksModal, setShowCreateNotebooksModal] =
    useState(false);

  const {
    data: notesAndNotebooks,
    isLoading,
    refetch,
  } = api.notes.getAllNotesAndNotebooks.useQuery();

  useEffect(() => {
    if (!isLoading) {
      refetch();
    }
  }, [isLoading, showCreateNoteModal, showCreateNotebooksModal, refetch]);

  return (
    <SessionRoute>
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
          <h1 className="text-lg font-semibold md:text-2xl">My Notes</h1>
          {isLoading ? (
            <div className="md:mt-15 mt-10 flex w-full items-center justify-center">
              <LoaderCircleIcon className="animate-spin" />
            </div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {notesAndNotebooks?.map((item) => (
                <NotesCard key={item.id} {...(item as NotesCardProps)} />
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default NotesPage;
