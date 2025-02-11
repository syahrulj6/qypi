import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";
import { SettingsHeader } from "../components/SettingsHeader";

const IntegrationsSettingsPage = () => {
  return (
    <SessionRoute>
      <DashboardLayout>
        <SettingsHeader />
        <h1>Integrations Settings</h1>
      </DashboardLayout>
    </SessionRoute>
  );
};

export default IntegrationsSettingsPage;
