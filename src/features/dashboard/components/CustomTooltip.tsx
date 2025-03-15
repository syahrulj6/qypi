import { format } from "date-fns";
import { TooltipProps } from "recharts";

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
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
