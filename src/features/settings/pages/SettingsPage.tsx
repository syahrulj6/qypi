import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";

const SettingsPage = () => {
  return (
    <SessionRoute>
      <DashboardLayout>
        <h1>Settings Page</h1>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default SettingsPage;
