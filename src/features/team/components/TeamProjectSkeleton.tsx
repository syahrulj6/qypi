import DashboardLayout from "~/components/layout/DashboardLayout";
import TeamLayout from "./TeamLayout";
import { Skeleton } from "~/components/ui/skeleton";

const TeamProjectsSkeleton = () => {
  return (
    <DashboardLayout>
      <TeamLayout breadcrumbItems={[]}>
        {/* HEADER SKELETON */}
        <div className="flex justify-between md:mr-8">
          <div className="flex flex-1 flex-col gap-1 md:gap-2">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-7 w-48 md:h-9 md:w-64" />
              <Skeleton className="h-4 w-64 md:h-5 md:w-80" />
            </div>
            <div className="mt-1 flex flex-wrap -space-x-3 md:mt-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="size-9 rounded-full md:size-10" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-32 md:h-10 md:w-36" />
          </div>
        </div>

        {/* PROJECTS LIST SKELETON */}
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="rounded-lg border p-4">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamProjectsSkeleton;
