import DashboardLayout from "~/components/layout/DashboardLayout";
import { useState } from "react";
import { useDashboardData } from "~/hooks/useDashboardData";
import { MetricsCard } from "../components/MetricsCard";
import { BarChartCard } from "../components/BarChartCard";
import { PieChartCard } from "../components/PieChartCard";
import { Mail, Send, StickyNote, Calendar, X } from "lucide-react";
import { chartActivityConfig } from "~/utils/type";
import { format } from "date-fns";

export default function MainDashboardPage() {
  const [openModal, setOpenModal] = useState<null | string>(null);
  const { activityCounts, sortedChartData, pieChartData, getLast7Activities } =
    useDashboardData();

  const totalActivities = pieChartData.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );

  return (
    <DashboardLayout>
      <div className="mt-4 flex flex-col space-y-7 pr-0 md:pr-8">
        {/* Metrics Card */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <MetricsCard
            title="Total Inbox Receive"
            value={activityCounts?.["INBOX_RECEIVED"] || 0}
            iconBg="bg-violet-200"
            icon={<Mail className="h-5 w-5 text-violet-500 md:h-6 md:w-6" />}
            onClick={() => setOpenModal("INBOX_RECEIVED")}
          />
          <MetricsCard
            title="Total Inbox Sent"
            value={activityCounts?.["INBOX_CREATED"] || 0}
            iconBg="bg-pink-100"
            icon={<Send className="h-5 w-5 text-pink-500 md:h-6 md:w-6" />}
            onClick={() => setOpenModal("INBOX_CREATED")}
          />
          <MetricsCard
            title="Note Created"
            value={activityCounts?.["NOTE_CREATED"] || 0}
            iconBg="bg-blue-200"
            icon={
              <StickyNote className="h-5 w-5 text-blue-500 md:h-6 md:w-6" />
            }
            onClick={() => setOpenModal("NOTE_CREATED")}
          />
          <MetricsCard
            title="Event Created"
            value={activityCounts?.["EVENT_CREATED"] || 0}
            iconBg="bg-green-100"
            icon={<Calendar className="h-5 w-5 text-green-500 md:h-6 md:w-6" />}
            onClick={() => setOpenModal("EVENT_CREATED")}
          />
        </div>

        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:gap-6">
          {/* Bar Chart */}
          <div className="w-full md:w-2/3">
            <BarChartCard data={sortedChartData} />
          </div>

          {/* Pie Chart */}
          <PieChartCard
            data={pieChartData}
            totalActivities={totalActivities}
            config={chartActivityConfig}
          />
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-96 rounded-lg border border-muted-foreground bg-card p-6 md:w-[30rem]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">
                  {openModal === "INBOX_RECEIVED"
                    ? "Received Inbox"
                    : openModal === "INBOX_CREATED"
                      ? "Sent Inbox"
                      : openModal === "NOTE_CREATED"
                        ? "Created Notes"
                        : "Created Events"}
                </h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  Last 7 {openModal.toLowerCase().replace(/_/g, " ")}
                </p>
              </div>
              <button onClick={() => setOpenModal(null)}>
                <X />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {getLast7Activities(openModal)?.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">
                      {activity.activityType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(activity.createdAt),
                        "MMM d, yyyy h:mm a",
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
