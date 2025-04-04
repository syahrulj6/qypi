import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { type CreateTaskFormSchema } from "../forms/task";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export const CreateTaskFormInner = () => {
  const form = useFormContext<CreateTaskFormSchema>();

  return (
    <>
      <FormField
        control={form.control}
        name="assignedTo"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>
              Undang Participants (Emails, dipisahkan dengan koma )
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="example1@gmail.com, example2@gmail.com"
                onChange={(e) =>
                  field.onChange(
                    e.target.value.split(",").map((email) => email.trim()),
                  )
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>
              Judul <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Masukkan judul task" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Deksripsi</FormLabel>
            <FormControl>
              <Textarea
                rows={3}
                {...field}
                placeholder="Masukkan deskripsi task"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="priority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Priority</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Deadline</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
                value={
                  field.value
                    ? new Date(field.value).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  field.onChange(isNaN(date.getTime()) ? null : date);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
