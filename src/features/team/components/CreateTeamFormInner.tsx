import { useFormContext } from "react-hook-form";
import { TeamFormSchema } from "../forms/team";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

export const CreateTeamFormInner = () => {
  const form = useFormContext<TeamFormSchema>();

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Nama Team</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Masukkan nama team" />
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
            <FormLabel>Deskripsi</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Deskripsi Team" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
