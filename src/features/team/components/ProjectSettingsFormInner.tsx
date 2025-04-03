import { useFormContext } from "react-hook-form";
import { ProjectSettingsSchema } from "../forms/project";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

interface ProjectSettingsFormInnerProps {
  isCurrentUserLead: boolean;
}

export const ProjectSettingsFormInner = ({
  isCurrentUserLead,
}: ProjectSettingsFormInnerProps) => {
  const form = useFormContext<ProjectSettingsSchema>();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Project Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter project name..."
                disabled={!isCurrentUserLead}
              />
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
            <FormLabel>Project Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Enter project description..."
                rows={4}
                disabled={!isCurrentUserLead}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>End Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} disabled={!isCurrentUserLead} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
