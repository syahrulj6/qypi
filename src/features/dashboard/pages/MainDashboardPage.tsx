import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import { Calendar, Mail, Send, StickyNote, TrendingUp } from "lucide-react";
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

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#4D55CC",
  },
  mobile: {
    label: "Mobile",
    color: "#69247C",
  },
} satisfies ChartConfig;

type ActivityCounts = Record<string, number>;

export default function MainDashboardPage() {
  const { data: userActivities } =
    api.userActivity.getUserActivities.useQuery();

  const activityCounts = userActivities?.reduce<ActivityCounts>(
    (acc, activity) => {
      acc[activity.activityType] = (acc[activity.activityType] || 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <DashboardLayout>
      <div className="mt-4 flex flex-col space-y-7 pr-0 md:pr-8">
        {/* Metrics Card */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <Card className="flex items-center justify-center gap-4 rounded-lg border bg-card px-4 py-6 md:gap-6">
            <div className="h-fit w-fit rounded-full bg-violet-100 p-3 md:h-14 md:w-14 md:p-4">
              <Mail className="h-5 w-5 text-violet-500 md:h-6 md:w-6" />
            </div>
            <div className="flex flex-col justify-between">
              <h5 className="text-sm font-semibold md:text-base">
                {activityCounts?.["INBOX_RECEIVED"] || 0}
              </h5>
              <p className="text-sm text-muted-foreground md:text-base">
                Total Inbox Receive
              </p>
            </div>
          </Card>

          <Card className="flex items-center justify-center gap-4 rounded-lg border bg-card px-4 py-6 md:gap-6">
            <div className="h-fit w-fit rounded-full bg-pink-100 p-3 md:h-14 md:w-14 md:p-4">
              <Send className="h-5 w-5 text-pink-500 md:h-6 md:w-6" />
            </div>
            <div className="flex flex-col justify-between">
              <h5 className="text-sm font-semibold md:text-base">
                {activityCounts?.["INBOX_CREATED"] || 0}
              </h5>
              <p className="text-sm text-muted-foreground md:text-base">
                Total Inbox Sent
              </p>
            </div>
          </Card>

          <Card className="flex items-center justify-center gap-4 rounded-lg border bg-card px-4 py-6 md:gap-6">
            <div className="h-fit w-fit rounded-full bg-blue-100 p-3 md:h-14 md:w-14 md:p-4">
              <StickyNote className="h-5 w-5 text-blue-500 md:h-6 md:w-6" />
            </div>
            <div className="flex flex-col justify-between">
              <h5 className="text-sm font-semibold md:text-base">
                {activityCounts?.["NOTE_CREATED"] || 0}
              </h5>
              <p className="text-sm text-muted-foreground md:text-base">
                Note Created
              </p>
            </div>
          </Card>

          <Card className="flex items-center justify-center gap-4 rounded-lg border bg-card px-4 py-6 md:gap-6">
            <div className="h-fit w-fit rounded-full bg-green-100 p-3 md:h-14 md:w-14 md:p-4">
              <Calendar className="h-5 w-5 text-green-500 md:h-6 md:w-6" />
            </div>
            <div className="flex flex-col justify-between">
              <h5 className="text-sm font-semibold md:text-base">
                {activityCounts?.["EVENT_CREATED"] || 0}
              </h5>
              <p className="text-sm text-muted-foreground md:text-base">
                Event Created
              </p>
            </div>
          </Card>

          {/* Chart */}
          <Card className="col-span-2 h-96 md:col-span-3">
            <CardHeader>
              <CardTitle>Your activities</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                  />
                  <Bar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    radius={4}
                  />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Your activites up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total activites for the last 6 months
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
