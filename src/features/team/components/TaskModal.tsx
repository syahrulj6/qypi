import { Button } from "~/components/ui/button";
import { Calendar, Check, Clock, FileText, Flag, User, X } from "lucide-react";
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

interface TaskModalProps {
  taskId: string;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}

export const TaskModal = ({
  isOpen,
  onClose,
  taskId,
  refetch,
}: TaskModalProps) => {
  const { data: taskData, isLoading } = api.task.getTaskById.useQuery(
    { taskId },
    {
      enabled: isOpen && !!taskId,
    },
  );

  const deleteTask = api.task.deleteTask.useMutation();

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 rounded-lg border border-muted-foreground bg-card p-6 md:w-[30rem]">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
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
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Status */}
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      taskData.status === "Completed" ? "default" : "secondary"
                    }
                    className="mt-1"
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
                  <Flag className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <Badge variant="outline" className="mt-1">
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
                        <Badge key={assignee.user.userId} variant="outline">
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
                    <p className="mt-1 text-sm">{taskData.description}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={onClose}>
                  Edit
                </Button>
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
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-64 items-center justify-center">
            <p>Task not found</p>
          </div>
        )}
      </div>
    </div>
  );
};
