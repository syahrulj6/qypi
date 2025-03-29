import { Skeleton } from "~/components/ui/skeleton";
import { Users, FolderOpen } from "lucide-react";
import DashboardLayout from "~/components/layout/DashboardLayout";
import TeamLayout from "./TeamLayout";

const TeamDetailSkeleton = () => {
  return (
    <DashboardLayout>
      <TeamLayout breadcrumbItems={[]}>
        {/* Team Detail Menu Button Skeleton */}
        <div className="flex justify-end">
          <Skeleton className="h-9 w-32" />
        </div>

        {/* Team Info Section Skeleton */}
        <div className="flex w-full flex-col gap-4 md:mt-4">
          {/* Team Name */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-48" />
          </div>

          {/* Team Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Team Members Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted p-3 md:grid-cols-5 md:p-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="grid grid-cols-1 gap-3 rounded-lg bg-muted p-3 md:grid-cols-3 md:p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-3 p-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TeamLayout>
    </DashboardLayout>
  );
};

export default TeamDetailSkeleton;
