import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { AddMemberFormSchema } from "../forms/member";

export const AddTeamMemberFormInner = () => {
  const form = useFormContext<AddMemberFormSchema>();

  return (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Masukkan email member" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
