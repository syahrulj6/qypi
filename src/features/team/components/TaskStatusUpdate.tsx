import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { api } from "~/utils/api";
import { toast } from "sonner";
import { Check, ChevronDown } from "lucide-react";
import { Badge } from "~/components/ui/badge";

const TASK_STATUS = ["Pending", "In Progress", "Completed"] as const;
type TaskStatus = (typeof TASK_STATUS)[number];

type TaskStatusUpdateProps = {
  taskId: string;
  currentStatus: string;
  refetchTask: () => void;
  refetchTasks: () => void;
  isAssigned: boolean;
};

export const TaskStatusUpdate = ({
  taskId,
  currentStatus,
  refetchTask,
  refetchTasks,
  isAssigned,
}: TaskStatusUpdateProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const updateStatus = api.task.updateTaskStatus.useMutation();

  const getStatusColor = (status: string) => {
    if (!TASK_STATUS.includes(status as TaskStatus))
      return "text-muted-foreground";
    switch (status) {
      case "Completed":
        return "text-green-500 ";
      case "In Progress":
        return "text-blue-500 ";
      default:
        return "text-yellow-500";
    }
  };

  const handleStatusUpdate = async (newStatus: TaskStatus) => {
    if (!isAssigned) return;

    try {
      setIsUpdating(true);
      await updateStatus.mutateAsync({
        taskId,
        status: newStatus,
      });
      toast.success(`Task marked as ${newStatus}`);
      refetchTask();
      refetchTasks();
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAssigned) return null;

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={`mt-1 capitalize ${getStatusColor(currentStatus)}`}
      >
        {currentStatus}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleStatusUpdate("In Progress")}>
            <Check className="mr-2 h-4 w-4 text-blue-500" />
            Mark as In Progress
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusUpdate("Completed")}>
            <Check className="mr-2 h-4 w-4 text-green-500" />
            Mark as Completed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
