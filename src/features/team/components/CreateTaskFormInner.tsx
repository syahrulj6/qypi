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
import { useState } from "react";
import { Textarea } from "~/components/ui/textarea";

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
            <FormLabel>Judul</FormLabel>
            <FormControl>
              <Textarea
                rows={10}
                {...field}
                placeholder="Masukkan judul jadwal"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dueDate"
        render={({ field }) => (
          <FormItem className="col-span-2">
            <FormLabel>
              Tanggal <span className="text-destructive">*</span>
            </FormLabel>
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
