import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { UpdateProjectTitleFormSchema } from "../forms/project";

export const UpdateProjectTitleFormInner = () => {
  const form = useFormContext<UpdateProjectTitleFormSchema>();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>
              Name <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Masukkan nama project" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
