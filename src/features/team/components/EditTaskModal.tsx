import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar, Check, FileText, Flag, User, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { api } from "~/utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const TASK_STATUS = ["Pending", "In Progress", "Completed"] as const;
const TASK_PRIORITY = ["Low", "Medium", "High"] as const;

type TaskStatus = (typeof TASK_STATUS)[number];
type TaskPriority = (typeof TASK_PRIORITY)[number];

type EditTaskModalProps = {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    priority: string | null;
    dueDate: Date | null;
    assignees?: {
      user: {
        userId: string;
        username: string;
      };
    }[];
  };
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
};

export const EditTaskModal = ({
  task,
  isOpen,
  onClose,
  refetch,
}: EditTaskModalProps) => {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate?.toISOString().split("T")[0] || "",
  });

  const updateTask = api.task.updateTask.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTask.mutateAsync({
        taskId: task.id,
        title: formData.title,
        description: formData.description || undefined,
        status: formData.status as TaskStatus,
        priority: formData.priority as TaskPriority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      });
      toast.success("Task updated successfully");
      refetch();
      onClose();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Status
              </label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">
                Priority
              </label>
              <Select
                value={formData.priority ?? ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, priority: value ?? "Medium" })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITY.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Due Date
            </label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateTask.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateTask.isPending}>
              {updateTask.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
