import DashboardLayout from "~/components/layout/DashboardLayout";
import { subDays, format } from "date-fns";
import { api } from "~/utils/api";
import { Calendar, Mail, Send, StickyNote, TrendingUp, X } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  PieChart,
  Pie,
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useMemo, useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

const chartVisitorsData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 287, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 190, fill: "var(--color-other)" },
];

const chartVisitorsConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const chartActivityConfig = {
  count: {
    label: "Activities",
    color: "#4D55CC",
  },
};

type ActivityCounts = Record<string, number>;

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const isValidDate = (dateString: string) => {
    return !isNaN(new Date(dateString).getTime());
  };

  if (active && payload && payload.length && label && isValidDate(label)) {
    return (
      <div className="rounded border bg-white p-2 shadow">
        <p className="font-medium">{format(new Date(label), "MMM d, yyyy")}</p>
        <p className="text-sm">Count: {payload[0]!.value}</p>
      </div>
    );
  }
  return null;
};

export default function MainDashboardPage() {
  const [openModal, setOpenModal] = useState<null | string>(null);

  const totalVisitors = useMemo(() => {
    return chartVisitorsData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

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

        <div className="flex w-full flex-row items-center gap-4 md:gap-6">
          {/* Chart */}
          <div className="w-full md:w-2/3">
            <Card className="flex w-full flex-col justify-center">
              <CardHeader>
                <CardTitle>Your activities</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="w-full md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sortedChartData}>
                    <CartesianGrid vertical={false} stroke="#eee" />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        format(new Date(value), "MMM d")
                      }
                      tick={{ fill: "#666", fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={false} />
                    <Bar
                      dataKey="count"
                      fill={chartActivityConfig.count.color}
                      radius={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
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
          <div className="flex-1 md:h-full">
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - Donut with Text</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={chartVisitorsConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="visitors"
                      nameKey="browser"
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {totalVisitors.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Visitors
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter>
            </Card>
          </div>
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
