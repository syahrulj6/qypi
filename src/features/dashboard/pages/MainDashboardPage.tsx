import DashboardLayout from "~/components/layout/DashboardLayout";
import { subDays, format } from "date-fns";
import { api } from "~/utils/api";
import { Calendar, Mail, Send, StickyNote, TrendingUp, X } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { useState } from "react";

const chartConfig = {
  count: {
    label: "Activities",
    color: "#4D55CC",
  },
} satisfies ChartConfig;

type ActivityCounts = Record<string, number>;

export default function MainDashboardPage() {
  const [openModal, setOpenModal] = useState<null | string>(null);

  const { data: userActivities } =
    api.userActivity.getUserActivities.useQuery();

  const activityCounts = userActivities?.reduce<ActivityCounts>(
    (acc, activity) => {
      acc[activity.activityType] = (acc[activity.activityType] || 0) + 1;
      return acc;
    },
    {},
  );

  const last7DaysActivities = userActivities?.filter((activity) => {
    const activityDate = new Date(activity.createdAt);
    const sevenDaysAgo = subDays(new Date(), 7);
    return activityDate >= sevenDaysAgo;
  });

  const activityCountsByDay = last7DaysActivities?.reduce<
    Record<string, number>
  >((acc, activity) => {
    const activityDate = format(new Date(activity.createdAt), "yyyy-MM-dd");
    acc[activityDate] = (acc[activityDate] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(activityCountsByDay || {}).map(
    ([date, count]) => ({
      date,
      count,
    }),
  );

  const sortedChartData = chartData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Function to get the last 7 activities for a specific type
  const getLast7Activities = (activityType: string) => {
    return userActivities
      ?.filter((activity) => activity.activityType === activityType)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 7);
  };

  return (
    <DashboardLayout>
      <div className="mt-4 flex flex-col space-y-7 pr-0 md:pr-8">
        {/* Metrics Card */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <Card
            onClick={() => setOpenModal("INBOX_RECEIVED")}
            className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card px-4 py-6 hover:cursor-pointer md:flex-row md:gap-6"
          >
            <div className="h-fit w-fit rounded-full bg-violet-100 p-3 md:h-14 md:w-14 md:p-4">
              <Mail className="h-5 w-5 text-violet-500 md:h-6 md:w-6" />
            </div>
            <div className="flex flex-col justify-between text-center md:text-left">
              <h5 className="text-sm font-semibold md:text-base">
                {activityCounts?.["INBOX_RECEIVED"] || 0}
              </h5>
              <p className="text-sm text-muted-foreground md:text-base">
                Total Inbox Receive
              </p>
            </div>
          </Card>

          <Card
            onClick={() => setOpenModal("INBOX_CREATED")}
            className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card px-4 py-6 hover:cursor-pointer md:flex-row md:gap-6"
          >
            <div className="h-fit w-fit rounded-full bg-pink-100 p-3 md:h-14 md:w-14 md:p-4">
              <Send className="h-5 w-5 text-pink-500 md:h-6 md:w-6" />
            </div>
            <div className="flex flex-col justify-between text-center md:text-left">
              <h5 className="text-sm font-semibold md:text-base">
                {activityCounts?.["INBOX_CREATED"] || 0}
              </h5>
              <p className="text-sm text-muted-foreground md:text-base">
                Total Inbox Sent
              </p>
            </div>
          </Card>

          <Card
            onClick={() => setOpenModal("NOTE_CREATED")}
            className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card px-4 py-6 hover:cursor-pointer md:flex-row md:gap-6"
          >
            <div className="h-fit w-fit rounded-full bg-blue-100 p-3 md:h-14 md:w-14 md:p-4">
              <StickyNote className="h-5 w-5 text-blue-500 md:h-6 md:w-6" />
            </div>
            <div className="flex flex-col justify-between text-center md:text-left">
              <h5 className="text-sm font-semibold md:text-base">
                {activityCounts?.["NOTE_CREATED"] || 0}
              </h5>
              <p className="text-sm text-muted-foreground md:text-base">
                Note Created
              </p>
            </div>
          </Card>

          <Card
            onClick={() => setOpenModal("EVENT_CREATED")}
            className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card px-4 py-6 hover:cursor-pointer md:flex-row md:gap-6"
          >
            <div className="h-fit w-fit rounded-full bg-green-100 p-3 md:h-14 md:w-14 md:p-4">
              <Calendar className="h-5 w-5 text-green-500 md:h-6 md:w-6" />
            </div>
            <div className="flex flex-col justify-between text-center md:text-left">
              <h5 className="text-sm font-semibold md:text-base">
                {activityCounts?.["EVENT_CREATED"] || 0}
              </h5>
              <p className="text-sm text-muted-foreground md:text-base">
                Event Created
              </p>
            </div>
          </Card>
        </div>

        {/* Chart */}
        <div className="w-full md:w-2/4">
          <Card className="flex w-full flex-col justify-center">
            <CardHeader>
              <CardTitle>Your activities</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={sortedChartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => format(new Date(value), "MMM d")}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="dashed"
                        labelFormatter={(value) =>
                          format(new Date(value), "MMM d, yyyy")
                        }
                      />
                    }
                  />
                  <Bar
                    dataKey="count"
                    fill={chartConfig.count.color}
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Your activities over the last 7 days{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total activities for the last 7 days
              </div>
            </CardFooter>
          </Card>
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
