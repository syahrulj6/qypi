import DashboardLayout from "~/components/layout/DashboardLayout";
import { api } from "~/utils/api";
import { Mail, TrendingUp } from "lucide-react";
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

export default function MainDashboardPage() {
  const { data: inboxData } = api.inbox.getInboxCountByMonth.useQuery();

  const totalInboxCount = inboxData
    ? Object.values(inboxData).reduce((sum, count) => sum + count, 0)
    : "";

  return (
    <DashboardLayout>
      <div className="mt-4 flex flex-col space-y-7">
        {/* Metrics Card */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="flex items-center justify-center gap-4 rounded-lg border bg-card px-4 py-6">
            <div className="h-14 w-14 rounded-full bg-violet-200 p-4">
              <Mail className="text-violet-500" />
            </div>
            <div className="flex flex-col justify-between">
              <h5 className="font-semibold">{totalInboxCount}</h5>
              <p className="text-muted-foreground">Total Inbox Created</p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <Card className="h-96 w-96">
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
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
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
    </DashboardLayout>
  );
}
