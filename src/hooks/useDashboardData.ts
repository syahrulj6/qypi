import { subDays, format } from "date-fns";
import { api } from "~/utils/api";
import { ChartActivityConfig, chartActivityConfig } from "~/utils/type";

type ActivityCounts = Record<string, number>;

export const useDashboardData = () => {
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

  const pieChartData = Object.entries(activityCounts || {}).map(
    ([activityType, count]) => ({
      name: activityType,
      value: count,
      fill:
        chartActivityConfig[activityType as keyof ChartActivityConfig]?.color ||
        "#000",
    }),
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

  return {
    activityCounts,
    sortedChartData,
    pieChartData,
    userActivities,
    getLast7Activities,
  };
};
