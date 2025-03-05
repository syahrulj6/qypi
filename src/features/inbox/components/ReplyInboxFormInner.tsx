import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";

import { InboxFormSchema } from "../forms/inbox";
import { Textarea } from "~/components/ui/textarea";

export const ReplyInboxFormInner = () => {
  const form = useFormContext<InboxFormSchema>();

  return (
    <>
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>
              Message <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Textarea rows={10} {...field} placeholder="Masukkan pesan" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
