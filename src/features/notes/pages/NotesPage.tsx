import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { CreateNoteMenuButton } from "../components/CreateNoteMenuButton";
import { useState } from "react";
import { CreateNoteModal } from "../components/CreateNoteModal";
import { CreateNotebookModal } from "../components/CreateNotebookModal";

export const NotesPage = () => {
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [showCreateNotebooksModal, setShowCreateNotebooksModal] =
    useState(false);

  return (
    <SessionRoute>
      <DashboardLayout>
        <CreateNoteMenuButton
          onOpenNote={() => setShowCreateNoteModal(true)}
          onOpenNotebook={() => setShowCreateNotebooksModal(true)}
        />
        {showCreateNoteModal && (
          <CreateNoteModal
            isOpen={showCreateNoteModal}
            onClose={() => setShowCreateNoteModal(false)}
          />
        )}
        {showCreateNotebooksModal && (
          <CreateNotebookModal
            isOpen={showCreateNotebooksModal}
            onClose={() => setShowCreateNotebooksModal(false)}
          />
        )}
        <div className="flex flex-col">
          <h1>Notes Page</h1>
        </div>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default NotesPage;
