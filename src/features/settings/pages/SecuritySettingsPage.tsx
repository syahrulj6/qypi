import DashboardLayout from "~/components/layout/DashboardLayout";
import { SettingsHeader } from "../components/SettingsHeader";
import { SessionRoute } from "~/components/layout/SessionRoute";

const SecuritySettingsPage = () => {
  return (
    <SessionRoute>
      <DashboardLayout>
        <SettingsHeader />
        <h1>Security Settings</h1>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default SecuritySettingsPage;
