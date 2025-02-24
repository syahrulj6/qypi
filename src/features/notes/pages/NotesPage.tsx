import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { CreateNoteMenuButton } from "../components/CreateNoteMenuButton";

export const NotesPage = () => {
  return (
    <SessionRoute>
      <DashboardLayout>
        <CreateNoteMenuButton />
        <h1>Notes page</h1>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default NotesPage;
