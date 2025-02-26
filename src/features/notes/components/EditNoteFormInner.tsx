import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { EditNoteFormSchema } from "../forms/edit-note";

export const EditNoteFormInner = () => {
  const form = useFormContext<EditNoteFormSchema>();

  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Judul</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Masukkan Judul..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>Content</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Isi content..." rows={10} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
