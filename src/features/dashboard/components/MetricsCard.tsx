import { Info } from "lucide-react";
import { Card } from "~/components/ui/card";

interface MetricsCardProps {
  title: string;
  value: number;
  iconBg?: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export const MetricsCard = ({
  title,
  value,
  icon,
  iconBg,
  onClick,
}: MetricsCardProps) => {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-card px-4 py-6 md:flex-row md:gap-6">
      <div
        className={`h-fit w-fit rounded-full p-3 md:h-14 md:w-14 md:p-4 ${iconBg ? iconBg : "bg-muted-foreground"}`}
      >
        {icon}
      </div>
      <div className="flex flex-col justify-between text-center md:text-left">
        <h5 className="text-sm font-semibold md:text-base">{value}</h5>
        <p className="text-sm text-muted-foreground md:text-base">{title}</p>
      </div>
      <div
        className="relative bottom-32 left-24 md:bottom-10 md:left-1"
        onClick={onClick}
      >
        <Info className="h-5 w-5 text-muted-foreground transition-colors hover:cursor-pointer hover:text-current" />
      </div>
    </Card>
  );
};
