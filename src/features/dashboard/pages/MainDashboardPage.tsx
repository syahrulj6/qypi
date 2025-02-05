import DashboardLayout from "~/components/layout/DashboardLayout";
import { SessionRoute } from "~/components/layout/SessionRoute";

export default function MainDashboardPage() {
  return (
    <SessionRoute>
      <DashboardLayout>
        <div className="mt-10 text-2xl font-bold text-primary">Hello World</div>
      </DashboardLayout>
    </SessionRoute>
  );
}
