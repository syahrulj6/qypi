import { Card, CardContent } from "~/components/ui/card";

export const ProfileSkeleton = () => {
  return (
    <Card>
      <CardContent className="flex animate-pulse gap-6 pt-6">
        <div className="h-24 w-24 rounded-full bg-gray-300" />
        <div className="flex w-full flex-col gap-4">
          <div className="h-6 w-3/4 rounded bg-gray-300" />
          <div className="h-6 w-1/2 rounded bg-gray-300" />
          <div className="h-4 w-full rounded bg-gray-300" />
        </div>
      </CardContent>
    </Card>
  );
};
