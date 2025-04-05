import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar, Check, FileText, Flag, Pencil, User, X } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { api } from "~/utils/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { TaskStatusUpdate } from "./TaskStatusUpdate";
import { EditTaskModal } from "./EditTaskModal";
import { useSession } from "~/hooks/useSession";

const TASK_STATUS = ["Pending", "In Progress", "Completed"] as const;
const TASK_PRIORITY = ["Low", "Medium", "High"] as const;

type TaskStatus = (typeof TASK_STATUS)[number];
type TaskPriority = (typeof TASK_PRIORITY)[number];

interface TaskModalProps {
  teamId: string;
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const TaskModal = ({
  isOpen,
  onClose,
  taskId,
  teamId,
  refetch,
}: TaskModalProps) => {
  const { session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const {
    data: taskData,
    isLoading,
    refetch: refetchTaskData,
  } = api.task.getTaskById.useQuery(
    { taskId },
    { enabled: isOpen && !!taskId },
  );

  const { data: getTeamData, isLoading: getTeamDataIsLoading } =
    api.team.getTeamById.useQuery(
      { id: teamId },
      { enabled: isOpen && !!teamId },
    );

  const deleteTask = api.task.deleteTask.useMutation();

  const isLead = session?.user?.id === getTeamData?.leadId;

  const isAssigned = taskData?.assignees.some(
    (assignee) => assignee.user.userId === session?.user.id,
  );

  const handleDeleteTask = () => {
    deleteTask.mutate(
      { taskId },
      {
        onSuccess: () => {
          toast.success("Task deleted successfully");
          refetch();
          onClose();
        },
        onError: () => {
          toast.error("Failed to delete task");
        },
      },
    );
  };

  const getStatusVariant = (status: string) => {
    if (!TASK_STATUS.includes(status as TaskStatus)) return "outline";
    switch (status) {
      case "Completed":
        return "default";
      case "In Progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    if (!TASK_STATUS.includes(status as TaskStatus))
      return "text-muted-foreground";
    switch (status) {
      case "Completed":
        return "text-green-500";
      case "In Progress":
        return "text-blue-500";
      default:
        return "text-yellow-500";
    }
  };

  const getPriorityVariant = (priority: string) => {
    if (!TASK_PRIORITY.includes(priority as TaskPriority)) return "outline";
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "secondary";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    if (!TASK_PRIORITY.includes(priority as TaskPriority))
      return "text-muted-foreground";
    switch (priority) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      default:
        return "text-green-500";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg border border-muted-foreground bg-card p-6 md:w-[30rem]">
        {isLoading || getTeamDataIsLoading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p>Loading task details...</p>
          </div>
        ) : taskData ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">{taskData.title}</h2>
                <p className="text-sm text-muted-foreground md:text-base">
                  Task details
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-sm p-1 transition-colors hover:bg-accent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <Check
                  className={`h-5 w-5 ${getStatusColor(taskData.status)}`}
                />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={getStatusVariant(taskData.status)}
                    className={`mt-1 capitalize ${getStatusColor(taskData.status)}`}
                  >
                    {taskData.status}
                  </Badge>
                </div>
              </div>

              {taskData.dueDate && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="mt-1 text-sm">
                      {format(new Date(taskData.dueDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
              )}

              {taskData.priority && (
                <div className="flex items-center gap-3">
                  <Flag
                    className={`h-5 w-5 ${getPriorityColor(taskData.priority)}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <Badge
                      variant={getPriorityVariant(taskData.priority)}
                      className={`mt-1 capitalize`}
                    >
                      {taskData.priority}
                    </Badge>
                  </div>
                </div>
              )}

              {taskData.assignees.length > 0 && (
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Assignees</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {taskData.assignees.map((assignee) => (
                        <Badge
                          key={assignee.user.userId}
                          variant="outline"
                          className="capitalize"
                        >
                          {assignee.user.username}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {taskData.description && (
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="mt-1 whitespace-pre-line text-sm">
                      {taskData.description}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                {isLead ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Task
                  </Button>
                ) : (
                  <TaskStatusUpdate
                    taskId={taskId}
                    currentStatus={taskData.status}
                    refetch={refetchTaskData}
                    isAssigned={isAssigned ?? false}
                  />
                )}

                {isLead && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this task? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600"
                          onClick={handleDeleteTask}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>

            {taskData && (
              <EditTaskModal
                task={taskData}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                refetch={refetchTaskData}
              />
            )}
          </>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center gap-2">
            <X className="h-8 w-8 text-destructive" />
            <p>Task not found</p>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
