import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { CreateNoteMenuButton } from "../components/CreateNoteMenuButton";
import { useState } from "react";
import { CreateNoteModal } from "../components/CreateNoteModal";
import { CreateNotebookModal } from "../components/CreateNotebookModal";
import { api } from "~/utils/api";

export const NotesPage = () => {
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);
  const [showCreateNotebooksModal, setShowCreateNotebooksModal] =
    useState(false);

  const { data: notesAndNotebooks, isLoading } =
    api.notes.getAllNotesAndNotebooks.useQuery();

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

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {notesAndNotebooks?.map((item) => {
                // TODO: Note UI
                // @ts-expect-error
                const notesCount = item.notesCount;

                return (
                  <li
                    key={item.id}
                    className="cursor-pointer rounded-md border p-3 hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-sm text-gray-500">
                          {item.type === "folder"
                            ? `Notebook (${notesCount} notes)`
                            : "Note"}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default NotesPage;
