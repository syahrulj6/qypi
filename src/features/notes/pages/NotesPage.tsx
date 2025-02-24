import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";

export const NotesPage = () => {
  return (
    <SessionRoute>
      <DashboardLayout>
        <h1>Notes page</h1>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default NotesPage;
