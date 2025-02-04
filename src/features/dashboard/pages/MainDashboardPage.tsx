import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";

export default function MainDashboardPage() {
  return (
    <SessionRoute>
      <DashboardLayout>
        <h1 className="text-2xl font-bold">Welcome to your Dashboard</h1>
        <p className="text-gray-700">Manage your content here.</p>
      </DashboardLayout>
    </SessionRoute>
  );
}
