import { useRouter } from "next/router";
import { api } from "~/utils/api";
import DashboardLayout from "~/components/layout/DashboardLayout";
import { ArrowLeft, LoaderCircleIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { CreateNoteModal } from "../components/CreateNoteModal";
import { NotesCard } from "../components/NotesCard";

const NoteDetailPage = () => {
  const [showCreateNoteModal, setShowCreateNoteModal] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id === undefined) return;
    if (!id) router.push("/dashboard");
  }, [id, router]);

  const { data, isLoading, refetch } = api.notes.getNoteOrNotebookById.useQuery(
    { id: id as string },
    { enabled: !!id },
  );

  const defaultColor = "#AA60C8";
  const bgColor =
    data?.type === "notebook" && data.color ? data.color : defaultColor;
  const bgColorWithOpacity = `${bgColor}99`;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mt-10 flex w-full items-center justify-center">
          <LoaderCircleIcon className="animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout>
        <div className="mt-10 text-center text-lg">
          Note or Notebook not found.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mt-2 flex flex-col md:pr-10">
        {showCreateNoteModal && (
          <CreateNoteModal
            notebookId={data.id}
            refetch={refetch}
            isOpen={showCreateNoteModal}
            onClose={() => setShowCreateNoteModal(false)}
          />
        )}

        <button className="group" onClick={() => router.back()}>
          <ArrowLeft className="text-neutral-700 transition-colors group-hover:text-current" />
        </button>

        {data.type === "notebook" ? (
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="col-span-2 flex items-center justify-between lg:col-span-4">
              <h1 className="text-2xl font-semibold">{data.title}</h1>
              <Button
                onClick={() => setShowCreateNoteModal(!showCreateNoteModal)}
              >
                Create Note <Plus />
              </Button>
            </div>
            {data?.notes?.map((note) => (
              <NotesCard
                key={note.id}
                id={note.id}
                refetch={refetch}
                title={note.title}
                type="note"
                color={bgColorWithOpacity}
                content={note.content}
                notesCount={data.notes.length}
                updatedAt={note.updatedAt}
              />
            ))}
          </div>
        ) : (
          // TODO : Note UI
          <div className="mt-4 rounded-lg border bg-white p-4 shadow">
            <p>{data.content || "No content available"}</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NoteDetailPage;
